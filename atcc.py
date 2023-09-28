import cv2
import torch
import numpy as np
import math
from super_gradients.training import models
from sort import *
from collections import deque
import random
import time

from database_connections import Entry_vehicle_database,Exit_vehicle_database

device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')

model = models.get('yolo_nas_s',pretrained_weights='coco').to(device) #1.yolonas small model == low accuracy but fast execution(s) 2. large model = high acuracy but low execution(l) 3 medium = (m)

path='E:/Python Project/Vheicle_tracking/ATCC/input_files/172.18.14.7_IPC_main_20230603081533_083959 - Trim - Trim - Trim.mp4'

cap = cv2.VideoCapture(path)

frame_width = int(cap.get(3))

frame_height = int(cap.get(4))

cameratype='CH103'
location='Pune'
# out = cv2.VideoWriter('video_l.mp4',cv2.VideoWriter_fourcc(*'H246'),15,(frame_width,frame_height))

totalcountup=[] #total no.of entry exit

totalcountdown=[] #total no of exit vheicle

# limitdown=[100,530,999,530]

# limitup = [1050,530,1700,530]


palette = (2 ** 11 - 1, 2 ** 15 - 1, 2 ** 20 - 1)

data_deque = {}

deepsort = None

object_counter = {}

object_counter1 = {}

line = [(100, 527), (1800, 527)]

# line = [(500, 250), (1500, 250)]


speed_line_queue = {}

totalcountup = []  # total no.of entry exit 
totalcountdown = []  # total no of exit vheicle

carupcount = []
truckupcount = []
busupcount = []
bikeupcount = []

cardowncount = []
truckdowncount = []
busdowncount = [] 
bikedowncount = []



def create_folder_according_date():    
    System_time = time.localtime(time.time())

    current_date="{yyyy}-{mm}-{dd}".format(yyyy=System_time[0],mm=System_time[1],dd=System_time[2])

    current_time="{hr}-{min}".format(hr=System_time[3],min=System_time[4])

    Images = 'Images'

    Video = 'Video'

    date_folder_path = 'output_file/'+ current_date


    video_folder_path = date_folder_path + '/'+ Video


    isdir = os.path.isdir(date_folder_path)
    # print("path2:",path2)
    try:
        if isdir==True:
            os.makedirs(video_folder_path,exist_ok=True)            
        else:
            
            # print("Folder not exists....")

            os.makedirs(date_folder_path, exist_ok = True)

            os.makedirs(video_folder_path,exist_ok=True)
            # print("Directory '%s' created successfully" %Video)

    except OSError as error:
            print("Directory '%s' can not be created")

    return video_folder_path


def video_save():
    data=create_folder_according_date()
    frame_width = int(cap.get(3))

    frame_height = int(cap.get(4))

    detected_video='detected.mp4'

    # image_storing_path = data[0]+'/'  # image path

    detected_video_store_path=data+'/'+ detected_video

    out = cv2.VideoWriter(detected_video_store_path, cv2.VideoWriter_fourcc(
        *'H264'), 15, (frame_width, frame_height))#XVID
    
    return out

def estimatespeed(Location1, Location2):
    #Euclidean Distance Formula
    d_pixel = math.sqrt(math.pow(Location2[0] - Location1[0], 2) + math.pow(Location2[1] - Location1[1], 2))
    # defining thr pixels per meter
    ppm = 8 #8
    d_meters = d_pixel/ppm
    time_constant = 15*3.6
    #distance = speed/time
    speed = d_meters * time_constant
    return int(speed)

def compute_color_for_labels(label):
    """
    Simple function that adds fixed color depending on the class
    """
    if label == 0: #person
        color = (85,45,255)
    elif label == 2: # Car
        color = (222,82,175)
    elif label == 3:  # Motobike
        color = (0, 204, 255)
    elif label == 5:  # Bus
        color = (0, 149, 255)
    else:
        color = [int((p * (label ** 2 - label + 1)) % 255) for p in palette]
    return tuple(color)

def draw_border(img, pt1, pt2, color, thickness, r, d):
    x1,y1 = pt1
    x2,y2 = pt2
    # Top left
    cv2.line(img, (x1 + r, y1), (x1 + r + d, y1), color, thickness)
    cv2.line(img, (x1, y1 + r), (x1, y1 + r + d), color, thickness)
    cv2.ellipse(img, (x1 + r, y1 + r), (r, r), 180, 0, 90, color, thickness)
    # Top right
    cv2.line(img, (x2 - r, y1), (x2 - r - d, y1), color, thickness)
    cv2.line(img, (x2, y1 + r), (x2, y1 + r + d), color, thickness)
    cv2.ellipse(img, (x2 - r, y1 + r), (r, r), 270, 0, 90, color, thickness)
    # Bottom left
    cv2.line(img, (x1 + r, y2), (x1 + r + d, y2), color, thickness)
    cv2.line(img, (x1, y2 - r), (x1, y2 - r - d), color, thickness)
    cv2.ellipse(img, (x1 + r, y2 - r), (r, r), 90, 0, 90, color, thickness)
    # Bottom right
    cv2.line(img, (x2 - r, y2), (x2 - r - d, y2), color, thickness)
    cv2.line(img, (x2, y2 - r), (x2, y2 - r - d), color, thickness)
    cv2.ellipse(img, (x2 - r, y2 - r), (r, r), 0, 0, 90, color, thickness)

    cv2.rectangle(img, (x1 + r, y1), (x2 - r, y2), color, -1, cv2.LINE_AA)
    cv2.rectangle(img, (x1, y1 + r), (x2, y2 - r - d), color, -1, cv2.LINE_AA)
    
    cv2.circle(img, (x1 +r, y1+r), 2, color, 12)
    cv2.circle(img, (x2 -r, y1+r), 2, color, 12)
    cv2.circle(img, (x1 +r, y2-r), 2, color, 12)
    cv2.circle(img, (x2 -r, y2-r), 2, color, 12)
    
    return img



def UI_box(x, img, color=None, label=None, line_thickness=None):
    # Plots one bounding box on image img
    tl = line_thickness or round(0.002 * (img.shape[0] + img.shape[1]) / 2) + 1  # line/font thickness
    color = color or [random.randint(0, 255) for _ in range(3)]
    c1, c2 = (int(x[0]), int(x[1])), (int(x[2]), int(x[3]))
    cv2.rectangle(img, c1, c2, color, thickness=tl, lineType=cv2.LINE_AA)
    if label:
        tf = max(tl - 1, 1)  # font thickness
        t_size = cv2.getTextSize(label, 0, fontScale=tl / 3, thickness=tf)[0]

        # img = draw_border(img, (c1[0], c1[1] - t_size[1] -3), (c1[0] + t_size[0], c1[1]+3), color, 1, 8, 2)

        cv2.putText(img, label, (c1[0], c1[1] - 2), 0, tl / 3, [225, 255, 255], thickness=tf, lineType=cv2.LINE_AA)

def intersect(A,B,C,D):
    return ccw(A,C,D) != ccw(B,C,D) and ccw(A,B,C) != ccw(A,B,D)

def ccw(A,B,C):
    return (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0])

def get_direction(point1, point2):
    direction_str = ""

    # calculate y axis direction
    if point1[1] > point2[1]:
        direction_str += "South"
    elif point1[1] < point2[1]:
        direction_str += "North"
    else:
        direction_str += ""

    # calculate x axis direction
    if point1[0] > point2[0]:
        direction_str += "East"
    elif point1[0] < point2[0]:
        direction_str += "West"
    else:
        direction_str += ""

    return direction_str

def draw_boxes(img, bbox,object_id, identities=None, offset=(0, 0)):

    cardown = 0
    truckdown = 0
    busdown = 0
    bikedown = 0

    carup = 0
    truckup = 0
    busup = 0
    bikeup = 0


    
    global addition_car_speed
    cv2.line(img, line[0], line[1], (46,162,112), 3)
    # cv2.line(img, line[2], line[3], (46,162,112), 3)

    height, width, _ = img.shape
    # remove tracked point from buffer if object is lost
    for key in list(data_deque):
      if key not in identities:
        data_deque.pop(key)

    for i, box in enumerate(bbox):
        x1, y1, x2, y2 = [int(i) for i in box]
        x1 += offset[0]
        x2 += offset[0]
        y1 += offset[1]
        y2 += offset[1]

        # code to find center of bottom edge
        center = (int((x2+x1)/ 2), int((y2+y2)/2))

        # get ID of object
        id = int(identities[i]) if identities is not None else 0

        # create new buffer for new object
        if id not in data_deque:  
          data_deque[id] = deque(maxlen= 64)
          speed_line_queue[id] = []
        color = compute_color_for_labels(object_id[i])
        obj_name = classNames[int(object_id[i])]
        # label = '{}{:d}'.format("", id) + ":"+ '%s' % (obj_name)
        label=obj_name
        # add center to buffer
        data_deque[id].appendleft(center)
        
        if len(data_deque[id]) >= 2:
          class_speed_sums = {
                'car': 0,
             
                }

          direction = get_direction(data_deque[id][0], data_deque[id][1])
          object_speed = estimatespeed(data_deque[id][1], data_deque[id][0])
          speed_line_queue[id].append(object_speed)
        
          if intersect(data_deque[id][0], data_deque[id][1], line[0], line[1]):

              cv2.line(img, line[0], line[1], (255, 255, 255), 3)
              if "South" in direction: #Car entering
                speed=str(sum(speed_line_queue[id])//len(speed_line_queue[id])) + "km/h"
                a_e_speed=str(sum(speed_line_queue[id])//len(speed_line_queue[id]))

                if label == 'truck':
                    truckdown += 1
                    truckdowncount.append(truckdown)
                elif label == 'car':
                    cardown += 1
                    cardowncount.append(cardown)
                elif label == 'bus':
                    busdown += 1
                    busdowncount.append(busdown)
                elif label == 'motorcycle' or label == 'person':
                    bikedown += 1
                    bikedowncount.append(bikedown)

                if obj_name not in object_counter:
                    object_counter[obj_name] = 1
                else:
                    object_counter[obj_name] += 1
                    
                Entry_vehicle_database(label,speed,cameratype,location)

                # cv2.putText(img,str("T")+':'+label+speed,(1500,280),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry

              if "North" in direction:#Car leaving
                speed1=str(sum(speed_line_queue[id])//len(speed_line_queue[id])) + "km/h"
                exi_speed=sum(speed_line_queue[id])//len(speed_line_queue[id])

                if label == 'truck':
                    truckup += 1
                    truckupcount.append(truckup)
                    # Leaving_truck_speed_sum+=exi_speed

                elif label == 'car':
                    carup += 1
                    carupcount.append(carup)
                    # Leaving_car_speed_sum += exi_speed
               
                elif label == 'bus':
                    busup += 1
                    busupcount.append(busup)
                elif label == 'motorcycle' or label == 'person':

                    bikeup += 1
                    bikeupcount.append(bikeup)

                if obj_name not in object_counter1:
                    object_counter1[obj_name] = 1
                else:
                    object_counter1[obj_name] += 1

                if label in class_speed_sums:
                    class_speed_sums[label] += exi_speed                
                Exit_vehicle_database(label,speed1,cameratype,location)
                # cv2.putText(img,str("detected")+':'+label+speed1,(100,280),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit

            #   cv2.putText(img,str("Leaving_car_speed_sum ")+':'+str(class_speed_sums),(100,180),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
      
        total_exiting_vehicle_count=len(truckupcount)+len(carupcount)+len(busupcount)+len(bikeupcount)

        # cv2.putText(img,str("truckup count ")+':'+str(len(truckupcount)),(100,150),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("carup count ")+':'+str(len(carupcount)),(100,180),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("busup count ")+':'+str(len(busupcount)),(100,210),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("bikeup count ")+':'+str(len(bikeupcount)),(100,240),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("Total leaving count")+':'+str(t_leaving),(100,270),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit

        # cv2.putText(img,str("Leaving_truck_speed_sum")+':'+str(addition_truck_speed),(100,150),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("Leaving_car_speed_sum ")+':'+str(class_speed_sums),(100,180),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("busup count ")+':'+str(len(busupcount)),(100,210),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("bikeup count ")+':'+str(len(bikeupcount)),(100,240),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit
        # cv2.putText(img,str("Total leaving count")+':'+str(t_leaving),(100,270),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Exit

        
        total_Entering_vehicle_count=len(truckdowncount)+len(cardowncount)+len(busdowncount)+len(bikedowncount)

        # cv2.putText(img,str("trucdown count")+':'+str(len(truckdowncount)),(1500,150),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry
        # cv2.putText(img,str("cardown count")+':'+str(len(cardowncount)),(1500,180),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry
        # cv2.putText(img,str("busdown count")+':'+str(len(busdowncount)),(1500,210),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry
        # cv2.putText(img,str("bikedown count")+':'+str(len(bikedowncount)),(1500,240),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry
        # cv2.putText(img,str("Total Entering count")+':'+str(t_Entering),(1500,280),0,1,(0,0,0),2,lineType=cv2.LINE_AA)#Entry

        # Entry_vtype_classification(carupcount,cardowncount,truckupcount,truckdowncount,busupcount,busdowncount,bikeupcount,bikedowncount)
        try:
            label = label + " " + str(sum(speed_line_queue[id])//len(speed_line_queue[id])) + "km/h"
        except:
            pass
        
        UI_box(box, img, label=label, color=color, line_thickness=2)
        # draw trail
        for i in range(1, len(data_deque[id])):
            # check if on buffer value is none
            if data_deque[id][i - 1] is None or data_deque[id][i] is None:
                continue
            # generate dynamic thickness of trails
            thickness = int(np.sqrt(64 / float(i + i)) * 1.5)
            # draw trails
            cv2.line(img, data_deque[id][i - 1], data_deque[id][i], color, thickness)
    
    #4. Display Count in top right corner
        # for idx, (key, value) in enumerate(object_counter1.items()):
        #     cnt_str1 = str(key) + ":" +str(value)
        #     cv2.line(img, (20,25), (500,25), [0,0,0], 40)
        #     cv2.putText(img, f'Numbers of Vehicles Leaving', (11, 35), 0, 1, [225, 255, 0], thickness=2, lineType=cv2.LINE_AA)    
        #     cv2.line(img, (20,65+ (idx*40)), (127,65+ (idx*40)), [0,0,0], 30)
        #     cv2.putText(img, cnt_str1, (11, 75+ (idx*40)), 0, 1, [225, 255, 0], thickness=2, lineType=cv2.LINE_AA)
        
        # for idx, (key, value) in enumerate(object_counter.items()):
        #     cnt_str = str(key) + ":" +str(value)
        #     cv2.line(img, (width - 500,25), (width,25), [0,0,0], 40)
        #     cv2.putText(img, f'Number of Vehicles Entering', (width - 500, 35), 0, 1, [225, 255, 0], thickness=2, lineType=cv2.LINE_AA)
        #     cv2.line(img, (width - 150, 65 + (idx*40)), (width, 65 + (idx*40)), [0, 0, 0], 30)
        #     cv2.putText(img, cnt_str, (width - 150, 75 + (idx*40)), 0, 1, [255, 255, 0], thickness = 2, lineType = cv2.LINE_AA)

    return img





count = 0


classNames = ["person","bicycle","car","motorcycle","airplane","bus","train","truck","boat","traffic light","fire hydrant","stop sign",
  "parking meter","bench","bird","cat","dog","horse","sheep","cow","elephant","bear","zebra","giraffe","backpack","umbrella","handbag",
  "tie","suitcase","frisbee","skis","snowboard","sports ball","kite","baseball bat","baseball glove","skateboard","surfboard","tennis racket",
  "bottle","wine glass","cup","fork","knife","spoon","bowl","banana","apple","sandwich","orange","broccoli","carrot","hot dog","pizza","donut",
  "cake","chair","couch","potted plant","bed","dining table","toilet","tv","laptop","mouse","remote","keyboard","cell phone","microwave","oven",
  "toaster","sink","refrigerator","book","clock","vase","scissors","teddy bear","hair drier","toothbrush",
]

# print(len(classNames))

#initialize tracker to track object
# tracker = Sort(maxDisappeared = 5, minHitRate = 0.5)
tracker = Sort(max_age=20, min_hits=3,iou_threshold=0.3)
"""max_age=20 :- if object id number is lost how many frame we should get back that means we define 20 if id is lost then 20 frame get it back
                our model wits 20 frame to get id back.
"""
while (cap.isOpened()):
    # get_data=video_save()

    ret,frame = cap.read()
    # print('hii')
    count+=1 #get frame counts
    # print(count)
    if ret:
        # get_data=video_save()

        detections = np.empty((0,6))#because we have x1,y1,x2,y2,conf five values so we gwet 0,5
        # print('hii')
        result = list(model.predict(frame,conf=0.35))[0]
        bbox_xyxys = result.prediction.bboxes_xyxy.tolist() # get bounding box co-ordinates
        confidences = result.prediction.confidence #get confidence score
        labels = result.prediction.labels.tolist()#get labels according object detection
        for(bbox_xyxy,confidence,cls) in zip(bbox_xyxys,confidences,labels):

            bbox = np.array(bbox_xyxy)
            x1,y1,x2,y2 = bbox[0],bbox[1],bbox[2],bbox[3]
            x1 ,y1,x2,y2 = int(x1),int(y1),int(x2),int(y2)
            classname =int(cls) #convert cls decimal number to int 
            classname= classNames[classname] #pass class int value to definde classNames list to get name of object according its obj int number
            # print(classname)
            conf = math.ceil((confidence*100))/100 # to get confidence of detected object
            currentArray = np.array([x1,y1,x2,y2, conf,cls])
            detections = np.vstack((detections,currentArray))# in case of list we do append operations but in array we do verticale stack one after other
        
        tracker_dets = tracker.update(detections)
        if len(tracker_dets)>0:
             bbox_xyxy = tracker_dets[:,:4]  #get bounding box co-ordinates get first four form x1,y1,x2,y2
             identities = tracker_dets[:,8] #get each object unique id's
             object_id = tracker_dets[:,4] #get categories of object like car , bike,etc.
             draw_boxes(frame, bbox_xyxy, object_id,identities)
        resized_frame=cv2.resize(frame,(0,0),fx=0.5,fy=0.5, interpolation = cv2.INTER_AREA) #resize the big resolution  frame
        # resized_frame=cv2.resize(img,(0,0),fx=0.5,fy=0.5, interpolation = cv2.INTER_AREA) #resize the big resolution  frame
        
        # get_data.write(frame) # Write a deteccted video
            # print(count,x1,y1,x2,y2)

        cv2.imshow('frame',resized_frame) # live detection shows
        if cv2.waitKey(1) & 0xFF==ord('q'):
                break
# get_data.release()
cap.release()
cv2.destroyAllWindows()


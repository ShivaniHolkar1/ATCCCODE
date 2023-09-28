import pymongo
from datetime import datetime
# from latest_db import Animal_latest
# client = pymongo.MongoClient('mongodb://192.168.2.170:27017')
client = pymongo.MongoClient('mongodb://localhost:27017')

db = client['ATCC']

enter_vheicle_counting = db['entercountings']

enter_vheicle_type = db['entervehicleclasss']

exit_vehicle_counting = db['exitcountings']

exit_vehicle_type = db['exitvehicleclasss']


def Entry_vehicle_database(label,speed,cameratype,location):
    # totalcountdown = len(totalcountdown)
    # totalcountup = len(totalcountup)
    column_data = []
    date = datetime.now().date()
    time = datetime.now().time()
    date = str(date)
    time = str(time)
    # print("date", date)

    for document in enter_vheicle_counting.find({}, {"date": 1}):
        column_data.append(document["date"])

    # Print the column data
    print('len', len(column_data))
    if len(column_data) == 0:
        wrong_side_data = {
                           'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
        result = enter_vheicle_counting.insert_one(wrong_side_data)
        # print(result.inserted_id)
        # print('hii')
    elif len(column_data) != 0:
        # for data in column_data:
        #     print(data)
        [data:=i for i in column_data]

        if data != date:
            print('Date not found.....So inserting new data')
            wrong_side_data = {'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
            result = enter_vheicle_counting.insert_one(wrong_side_data)
            # print(result.inserted_id)
        else:

            wrong_side_data = {'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
            result = enter_vheicle_counting.insert_one(wrong_side_data)


def Entry_vtype_classification( ce, te, be, bie):
    
    ce = len(ce)
    te = len(te)
    be = len(be)
    bie = len(bie)

    # Connect to MongoDB
    # vheicle_counting = db[vheicle_type]

    current_date = datetime.now().date()

    # Define the updates for each vehicle type
    vehicle_updates = {
        "Car": {"noOfLeaving": ce, "AvgSpeed":0},
        "Truck": {"noOfLeaving": te, "AvgSpeed": 0},
        "Bus": {"noOfLeaving": be, "AvgSpeed": 0},
        "Bike": {"noOfLeaving": bie, "AvgSpeed": 0}
    }

    # Check if the current date exists in the collection
    if enter_vheicle_type.count_documents({"date": str(current_date)}) == 0:
        print("Date not found..Creating current date database")
        for vtype in vehicle_updates:
            update_values = vehicle_updates[vtype]
            update_values["vehicletype"] = vtype
            update_values["date"] = str(current_date)
            result = enter_vheicle_type.insert_one(update_values)
            # print(result.inserted_id)
    else:
        print(f"Values updated in rows for {current_date}")

        # Find rows with a specific date and update them
        rows = enter_vheicle_type.find({"date": str(current_date)})
        for row in rows:
            vehicle_type = row["vehicletype"]
            if vehicle_type in vehicle_updates:
                update_values = vehicle_updates[vehicle_type]
                enter_vheicle_type.update_one({"_id": row["_id"]}, {
                                        "$set": update_values})







def Exit_vehicle_database(label,speed,cameratype,location):
    # totalcountdown = len(totalcountdown)
    # totalcountup = len(totalcountup)
    column_data = []
    date = datetime.now().date()
    time = datetime.now().time()
    date = str(date)
    time = str(time)

    # print("date", date)

    for document in exit_vehicle_counting.find({}, {"date": 1}):
        column_data.append(document["date"])

    # Print the column data
    print('len', len(column_data))
    if len(column_data) == 0:
        wrong_side_data = {
                           'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
        result = exit_vehicle_counting.insert_one(wrong_side_data)
        # Exit_vtype_classification(carupcount,truckupcount,busupcount,bikeupcount,date)
        # print(result.inserted_id)
        # print('hii')
    elif len(column_data) != 0:
        # for data in column_data:
        #     print(data)
        [data:=i for i in column_data]

        if data != date:
            print('Date not found.....So inserting new data')
            wrong_side_data = {'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
            result = exit_vehicle_counting.insert_one(wrong_side_data)
            # print(result.inserted_id)
            # Exit_vtype_classification(carupcount,truckupcount,busupcount,bikeupcount,date)

        else:

            wrong_side_data = {'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
            result = exit_vehicle_counting.insert_one(wrong_side_data)
            # Exit_vtype_classification(carupcount,truckupcount,busupcount,bikeupcount,date)

def Exit_vehicles_avg_speed(current_date):
    print('Geting Avg speed of Exit vehicle...')
    # current_date = datetime.now().date()
    # print(f'current date is :{str(current_date)}')
    
    car_speed_addition=0
    truck_speed_addition=0
    bus_speed_addition=0
    bike_speed_addition=0


    if exit_vehicle_counting.count_documents({"date": str(current_date)}) == 0:
        print(f"No data Exits..")
        pass
    else:
        rows=exit_vehicle_counting.find({'date':str(current_date)})

        # car_speed_addition=0
        # truck_speed_addition=0
        # bus_speed_addition=0
        # bike_speed_addition=0

        for row in rows:
            # print("row in db",row)
            vehicle_types=row['vehicletype']
            # print('vtypes in db:',vehicle_types)
            if vehicle_types=='car':
                c_sp=row['speed']
                c_sp=c_sp[:3]
                c_sp=int(c_sp)
                car_speed_addition+=c_sp
            elif vehicle_types=='truck':
                t_sp=row['speed']
                t_sp=t_sp[:3]
                t_sp=int(t_sp)
                truck_speed_addition +=t_sp
            elif vehicle_types=='bus':
                b_sp=row['speed']
                b_sp=b_sp[:3]
                b_sp=int(b_sp)
                bus_speed_addition+=b_sp
            elif vehicle_types == 'motorcycle':
                bike_sp=row['speed']
                bike_sp=bike_sp[:3]
                bike_sp=int(bike_sp)
                bike_speed_addition+=bike_sp
                # print(t_sp)
        
        # print(f'additon of car speed {car_speed_addition}')
        # print(f'truck addition:{truck_speed_addition}')
        # print(f'bus addition: {bus_speed_addition}')
        # print(f'motor cycle addition: {bike_speed_addition}')

    # c_avg=car_speed_addition/3
    # c2_avg=car_speed_addition//3
    # print(c2_avg,c2_avg)

    return car_speed_addition,truck_speed_addition,bus_speed_addition,bike_speed_addition

# Exit_vehicles_avg_speed()

def Exit_vtype_classification(cl, tl, bl, bil):
    cl = len(cl)
    tl = len(tl)
    bl = len(bl)
    bil = len(bil)

    c_avg=0
    t_avg=0
    b_avg=0
    bi_avg=0


    current_date = datetime.now().date()
    # speed_addition=Exit_vehicles_avg_speed(current_date)
    # c_avg=speed_addition[0]/cl
    # t_avg=speed_addition[1]/tl
    # b_avg=speed_addition[2]/bl
    # bi_avg=speed_addition[3]/bil
    # Define the updates for each vehicle type
    vehicle_updates = {
        "Car": {"noOfLeaving": cl, "AvgSpeed": c_avg},
        "Truck": {"noOfLeaving": tl, "AvgSpeed": t_avg},
        "Bus": {"noOfLeaving": bl, "AvgSpeed": b_avg},
        "Bike": {"noOfLeaving": bil, "AvgSpeed": bi_avg}
    }

    # Check if the current date exists in the collection
    if exit_vehicle_type.count_documents({"date": str(current_date)}) == 0:
        print("Date not found..Creating current date database")
        for vtype in vehicle_updates:
            update_values = vehicle_updates[vtype]
            update_values["vehicletype"] = vtype
            update_values["date"] = str(current_date)
            result = exit_vehicle_type.insert_one(update_values)
            # print(result.inserted_id)
    else:
        print(f"Values updated in rows for {current_date}")

        # Find rows with a specific date and update them
        rows = exit_vehicle_type.find({"date": str(current_date)})
        for row in rows:
            vehicle_type = row["vehicletype"]
            if vehicle_type in vehicle_updates:
                update_values = vehicle_updates[vehicle_type]
                exit_vehicle_type.update_one({"_id": row["_id"]}, {
                                        "$set": update_values})

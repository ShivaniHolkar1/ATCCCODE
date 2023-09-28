import pymongo
from datetime import datetime
# from latest_db import Animal_latest
# client = pymongo.MongoClient('mongodb://192.168.2.170:27017')
client = pymongo.MongoClient('mongodb://localhost:27017')

db = client['ATCC']

enter_vheicle_counting = db['entercountings']

# enter_vheicle_type = db['entervehicleclasss']

exit_vehicle_counting = db['exitcountings']

# exit_vehicle_type = db['exitvehicleclasss']


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

# def Entry_vtype_classification(cl, ce, tl, te, bl, be, bil, bie):
    
#     cl = len(cl)
#     ce = len(ce)
#     tl = len(tl)
#     te = len(te)
#     bl = len(bl)
#     be = len(be)
#     bil = len(bil)
#     bie = len(bie)

#     # Connect to MongoDB
#     # vheicle_counting = db[vheicle_type]

#     current_date = datetime.now().date()

#     # Define the updates for each vehicle type
#     vehicle_updates = {
#         "Car": {"noOfLeaving": cl, "AvgSpeed": ce},
#         "Truck": {"noOfLeaving": tl, "AvgSpeed": te},
#         "Bus": {"noOfLeaving": bl, "AvgSpeed": be},
#         "Bike": {"noOfLeaving": bil, "AvgSpeed": bie}
#     }

#     # Check if the current date exists in the collection
#     if enter_vheicle_type.count_documents({"date": str(current_date)}) == 0:
#         print("Date not found..Creating current date database")
#         for vtype in vehicle_updates:
#             update_values = vehicle_updates[vtype]
#             update_values["vehicletype"] = vtype
#             update_values["date"] = str(current_date)
#             result = enter_vheicle_type.insert_one(update_values)
#             # print(result.inserted_id)
#     else:
#         print(f"Values updated in rows for {current_date}")

#         # Find rows with a specific date and update them
#         rows = enter_vheicle_type.find({"date": str(current_date)})
#         for row in rows:
#             vehicle_type = row["vehicletype"]
#             if vehicle_type in vehicle_updates:
#                 update_values = vehicle_updates[vehicle_type]
#                 enter_vheicle_type.update_one({"_id": row["_id"]}, {
#                                         "$set": update_values})



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
        else:

            wrong_side_data = {'date': date, 'time':time,'vehicletype': label,'speed':speed,'cameratype': cameratype, 'location': location}
            result = exit_vehicle_counting.insert_one(wrong_side_data)


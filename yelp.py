from env.passwords import *
import requests

# Define the Yelp API endpoint and headers with the token

headers = {
    "Authorization": f"Bearer {yelptoken}" 
}

def getHalalFood(location="New York City", price=1):
    url = f"https://api.yelp.com/v3/businesses/search?location={location}&term=halal&categories=Restaurants&categories=Cafe&categories=Carts&categories=Ghost%20Kitchen&price={price}&sort_by=best_match&limit=20"
    # Make the GET request to the Yelp API
    response = requests.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Print the JSON response if the request was successful
        data = response.json()
        return(data)
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


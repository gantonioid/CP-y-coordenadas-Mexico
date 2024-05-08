import json

# Read data from file
with open("data.txt", "r") as file:
    lines = file.readlines()

# Initialize an empty list to store the parsed data
data = []

# Iterate over each line in the file
for line in lines:
    # Check if the line starts with "INSERT INTO"
    if "INSERT INTO" in line:
        print(f"Skipping line: {line.strip()}")
        continue  # Skip lines that don't contain data
    # Extract data from the line
    parts = line.split(",")
    # print(f"Parts: {parts}")
    # Check if all required parts are present and not empty
    if len(parts) == 7:
        # Convert required parts to appropriate types
        # id_ = int(parts[0].strip().strip("`'"))
        # colonia = parts[1].strip().strip("`'")
        # municipio = int(parts[2].strip().strip("`'"))
        # asentamiento = parts[3].strip().strip("`'")
        codigo_postal = int(parts[4].strip().strip("`'"))
        latitud = parts[5].strip().strip("`'")
        longitud = parts[6].strip().strip("`'")
        # Append the parsed data to the list
        data.append((
            # id_, colonia, municipio, asentamiento, 
            codigo_postal, latitud, longitud
            ))

# Create a dictionary to store postal codes and corresponding latitude and longitude pairs
postal_code_dict = {}

# Iterate over each entry in the parsed data
for entry in data:
    # Extract postal code, latitude, and longitude
    postal_code, latitude, longitude = entry
    # Add latitude and longitude pair to the dictionary with postal code as key
    # postal_code_dict.setdefault(postal_code, []).append((latitude, longitude))
    # postal_code_dict.setdefault(postal_code, {"latitude": latitude, "longitude": longitude})
    postal_code_dict.setdefault(codigo_postal, []).append({"latitude": latitude, "longitude": longitude})

# Convert the dictionary to JSON format
json_data = json.dumps(postal_code_dict, indent=4)

# Write the JSON data to a file
with open("output.json", "w") as outfile:
    outfile.write(json_data)
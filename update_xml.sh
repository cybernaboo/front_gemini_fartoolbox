#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <xml_file> <backend_value> <dateid_value> <filename_value>"
    exit 1
fi

XML_FILE="$1"

# Escape backslashes in the input values for sed
BACKEND_VALUE=$(echo "$2" | sed 's/\\/\\\\/g')
DATEID_VALUE=$(echo "$3" | sed 's/\\/\\\\/g')
FILENAME_VALUE=$(echo "$4" | sed 's/\\/\\\\/g')

# Use sed to update the values within the specified group
sed -i.bak "/group name = \"test\"/,/\/group/ {
    s|        <var name =\"backend\" value = \".*\" />|        <var name =\"backend\" value = \"${BACKEND_VALUE}\" />|g
    s|        <var name =\"dateid\" value = \".*\" />|        <var name =\"dateid\" value = \"${DATEID_VALUE}\" />|g
    s|        <var name =\"filename\" value = \".*\" />|        <var name =\"filename\" value = \"${FILENAME_VALUE}\" />|g
}" "$XML_FILE"

echo "XML file '$XML_FILE' updated successfully."
echo "A backup of the original file has been created: ${XML_FILE}.bak"

#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 7 ]; then
    echo "Usage: $0 <xml_file> <backend_value> <sourcetype_value> <dateid_value> <name_value> <dslpath_value> <sourcepatch_value>"
    exit 1
fi

XML_FILE="$1"

# Escape backslashes in the input values for sed
BACKEND_VALUE=$(echo "$2" | sed 's/\\/\\\\/g')
SOURCETYPE_VALUE=$(echo "$3" | sed 's/\\/\\\\/g')
DATEID_VALUE=$(echo "$4" | sed 's/\\/\\\\/g')
NAME_VALUE=$(echo "$5" | sed 's/\\/\\\\/g')
DSLPATH_VALUE=$(echo "$6" | sed 's/\\/\\\\/g')
SOURCEPATCH_VALUE=$(echo "$7" | sed 's/\\/\\\\/g')

# Use sed to update the values within the specified group
sed -i.bak "/group name = \"test\"/,/\/group/ {
    s|        <var name =\"BackEnd\" value = \".*\" />|        <var name =\"BackEnd\" value = \"${BACKEND_VALUE}\" />|g
    s|        <var name =\"SourceType\" value = \".*\" />|        <var name =\"SourceType\" value = \"${SOURCETYPE_VALUE}\" />|g
    s|        <var name =\"DateId\" value = \".*\" />|        <var name =\"DateId\" value = \"${DATEID_VALUE}\" />|g
    s|        <var name =\"Name\" value = \".*\" />|        <var name =\"Name\" value = \"${NAME_VALUE}\" />|g
    s|        <var name =\"DslPath\" value = \".*\" />|        <var name =\"DslPath\" value = \"${DSLPATH_VALUE}\" />|g
    s|        <var name =\"SourcePatch\" value = \".*\" />|        <var name =\"SourcePatch\" value = \"${SOURCEPATCH_VALUE}\" />|g
}" "$XML_FILE"

echo "XML file '$XML_FILE' updated successfully."
echo "A backup of the original file has been created: ${XML_FILE}.bak"
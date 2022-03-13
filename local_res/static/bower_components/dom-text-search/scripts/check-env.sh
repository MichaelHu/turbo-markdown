#!/bin/bash

node_version=$(node -v | awk -Fv '{print $2}')
if [ $node_version != '8.9.4' ]; then
    echo 
    echo "# =================================== \033[31m\033[4mERROR\033[0m ==================================== #"
    echo "# current is \033[33m node-v$node_version \033[0m, please use \033[33mnode-v8.9.4\033[0m"
    echo "# =================================== \033[31m\033[4mERROR\033[0m ==================================== #"
    echo 
    exit 1
fi


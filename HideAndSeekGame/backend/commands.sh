aws ecs create-service --cluster hasura-fargate-cluster --service-name hasura-fargate-service --task-definition hasura:1 --desired-count 1 --launch-type "FARGATE" --network-configuration "awsvpcConfiguration={subnets=[subnet-018d79c0bdcb425cd,subnet-0214a8dcec345dd73],securityGroups=[sg-039df12137636f2a5],assignPublicIp=ENABLED}"


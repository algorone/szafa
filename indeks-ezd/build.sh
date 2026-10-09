CALL_DIR="$(pwd)"
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
cd $SCRIPT_DIR
mvn package -Dquarkus.package.jar.type=uber-jar
mvn package -Dnative
docker build . -f src/main/docker/Dockerfile.native -t indeks-ezd
cd $CALL_DIR
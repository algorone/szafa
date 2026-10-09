CALL_DIR="$(pwd)"
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
cd $SCRIPT_DIR
./mvnw package -Dquarkus.package.jar.type=uber-jar
./mvnw package -Dnative
docker build . -f src/main/docker/Dockerfile.native -t repozytorium-ezd
cd $CALL_DIR
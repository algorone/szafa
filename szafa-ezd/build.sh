SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
#cd $SCRIPT_DIR/gui
docker build -t szafa-ezd $SCRIPT_DIR/gui/
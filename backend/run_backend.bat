@echo off
cd /d "c:\Users\RaphaelChiemerieEzem\projects\FlaskApp\shopnaija\backend"
echo Activating virtual environment...
call eshop\Scripts\activate.bat
echo.
echo Initializing database...
python init_db.py
echo.
echo Starting Flask server...
python start_server.py

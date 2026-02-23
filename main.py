try:
    from backend.app.main import app
except Exception as e:
    import sys
    import traceback
    print("FATAL ERROR IMPORTING APP:", file=sys.stderr)
    traceback.print_exc()
    raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        reload=True,
        reload_dirs=["app"],
        host="0.0.0.0",
        port=8000,
    )

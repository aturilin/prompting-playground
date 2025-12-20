{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.fastapi
    pkgs.python311Packages.uvicorn
    pkgs.python311Packages.httpx
    pkgs.python311Packages.python-dotenv
    pkgs.python311Packages.pydantic
    pkgs.nodejs_20
  ];
}

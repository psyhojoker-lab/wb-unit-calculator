from setuptools import setup, find_packages

setup(
    name="wb_calculator",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "psycopg2-binary",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-dotenv",
        "pydantic-settings",
    ],
)
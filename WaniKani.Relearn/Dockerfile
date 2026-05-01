# Stage 1: Base runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0.7-alpine3.23 AS base
WORKDIR /app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0.203-alpine3.23 AS build
WORKDIR /src

# Copy only the project file first for better caching
COPY ["WaniKani.Relearn.csproj", "./"]
RUN dotnet restore "WaniKani.Relearn.csproj"

# Copy the rest of the source code into /src
COPY . .

# Build the project
RUN dotnet build "WaniKani.Relearn.csproj" -c Release -o /app/build

# Stage 3: Publish
FROM build AS publish
RUN dotnet publish "WaniKani.Relearn.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WaniKani.Relearn.dll"]
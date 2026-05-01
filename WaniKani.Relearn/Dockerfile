FROM mcr.microsoft.com/dotnet/aspnet:10.0.7-alpine3.23 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:10.0.203-alpine3.23 AS build
WORKDIR /app
COPY ["WaniKani.Relearn.csproj", "WaniKani.Relearn/"]
RUN dotnet restore "WaniKani.Relearn/WaniKani.Relearn.csproj"
COPY . ./
WORKDIR "/app/WaniKani.Relearn"
RUN dotnet build "WaniKani.Relearn.csproj" -c Release -o /app/build

FROM build AS publish
WORKDIR "/app/WaniKani.Relearn"
RUN dotnet publish "WaniKani.Relearn.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WaniKani.Relearn.dll"]
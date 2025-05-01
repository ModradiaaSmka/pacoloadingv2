
local function GetPlayers()
    local players = {}
    for _, player in ipairs(GetActivePlayers()) do
        local playerId = GetPlayerServerId(player)
        local playerName = GetPlayerName(player)
        
        table.insert(players, {
            id = playerId,
            name = playerName
        })
    end
    return players
end

Citizen.CreateThread(function()
    while true do
        if IsLoadingScreenActive() then
            SendNUIMessage({
                type = "playerData",
                players = GetPlayers()
            })
        end
        Citizen.Wait(1000) 
    end
end)

Citizen.CreateThread(function()
    Citizen.Wait(500)
    
    if IsLoadingScreenActive() then
        SendNUIMessage({
            type = "autoPlayMusic"
        })
        

        local attempts = 0
        while IsLoadingScreenActive() and attempts < 10 do
            Citizen.Wait(2000)
            SendNUIMessage({
                type = "autoPlayMusic"
            })
            attempts = attempts + 1
        end
    end
end)

AddEventHandler('playerSpawned', function()
    SendNUIMessage({
        type = "autoPlayMusic"
    })
end)

RegisterCommand("setvideo", function(source, args, rawCommand)
    if args[1] then
        local videoPath = args[1]
        SendNUIMessage({
            type = "setVideo",
            path = videoPath
        })
        TriggerEvent("chat:addMessage", {
            color = {255, 0, 255},
            multiline = true,
            args = {"System", "Loading screen video set to: " .. videoPath}
        })
    else
        TriggerEvent("chat:addMessage", {
            color = {255, 0, 255},
            multiline = true,
            args = {"System", "Usage: /setvideo [path]"}
        })
    end
end, false)

RegisterCommand("setmusic", function(source, args, rawCommand)
    if args[1] then
        local musicPath = args[1]
        local musicTitle = args[2] or "Custom Track"
        
        SendNUIMessage({
            type = "setMusic",
            path = musicPath,
            title = musicTitle
        })
        
        TriggerEvent("chat:addMessage", {
            color = {255, 0, 255},
            multiline = true,
            args = {"System", "Loading screen music set to: " .. musicTitle}
        })
    else
        TriggerEvent("chat:addMessage", {
            color = {255, 0, 255},
            multiline = true,
            args = {"System", "Usage: /setmusic [path] [title]"}
        })
    end
end, false)

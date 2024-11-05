'use client'

import { useState, useEffect } from 'react'
import { TIMES, WMO } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ReloadIcon } from "@radix-ui/react-icons"

type WeatherData = {
  current: {
    temperature_2m: number
    weather_code: number
  }
}

export function WeatherInfo() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code&latitude=${latitude}&longitude=${longitude}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      const data: WeatherData = await response.json()
      setWeatherData(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setError('Failed to fetch weather data')
    } finally {
      setIsLoading(false)
    }
  }

  const getLocation = () => {
    setIsLoading(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error(error)
          setError('Unable to retrieve your location')
          setIsLoading(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  const weather = weatherData ? WMO.get(weatherData.current.weather_code) : null

  return (
    <Card className="h-full">
      <CardHeader className="relative w-full flex items-start justify-between flex-row">
        <CardTitle>Weather</CardTitle>
        <Button
          disabled={isLoading}
          className="size-10 absolute right-4 top-4"
          onClick={getLocation}
        >
          <ReloadIcon className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {isLoading ? (
          <div className="text-2xl font-bold">Loading weather data...</div>
        ) : error ? (
          <div className="text-2xl font-bold text-red-500">{error}</div>
        ) : weatherData && weather ? (
          <>
            <Image src={weather.icon} alt={weather.text} width={80} height={80} />
            <div className="text-2xl font-bold">{weatherData.current.temperature_2m}°C</div>
          </>
        ) : (
          <div className="text-2xl font-bold">Weather could not be loaded</div>
        )}
      </CardContent>
    </Card>
  )
}
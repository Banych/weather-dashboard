export interface WeatherDTO {
  time: string[];
  temperature_2m?: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
}

export interface WeatherUnitsDTO {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
}

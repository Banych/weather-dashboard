import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';
import { Temperature } from '@/domain/models/Temperature';

export class WeatherReport {
  private _temperatures: Temperature[] = [];

  constructor(
    private weatherData: WeatherDTO,
    private units: WeatherUnitsDTO
  ) {}

  get Temperatures(): Temperature[] {
    if (this._temperatures.length === 0) {
      this._temperatures = Temperature.fromWeatherDTO(
        this.weatherData,
        this.units
      );
    }

    return this._temperatures;
  }

  static fromWeatherDTO(
    dto: WeatherDTO,
    units: WeatherUnitsDTO
  ): WeatherReport {
    if (!dto) {
      throw new Error('Invalid WeatherDTO');
    }

    if (!units) {
      throw new Error('Invalid WeatherUnitsDTO');
    }

    if (!dto.time || dto.time.length === 0) {
      throw new Error('Invalid WeatherDTO: time is required');
    }

    if (
      !dto.temperature_2m &&
      !dto.relative_humidity_2m &&
      !dto.wind_speed_10m
    ) {
      throw new Error(
        'Invalid WeatherDTO: at least one of temperature_2m, relative_humidity_2m, wind_speed_10m is required'
      );
    }

    return new WeatherReport(dto, units);
  }
}

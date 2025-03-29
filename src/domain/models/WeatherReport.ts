import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';
import { RelativeHumidity } from '@/domain/models/RelativeHumidity';
import { Temperature } from '@/domain/models/Temperature';
import { WindSpeed } from '@/domain/models/WindSpeed';

export class WeatherReport {
  private _temperatures: Temperature[] = [];
  private _relativeHumidity: RelativeHumidity[] = [];
  private _windSpeed: WindSpeed[] = [];

  constructor(
    private weatherData: WeatherDTO,
    private units: WeatherUnitsDTO
  ) {}

  get temperatures(): Temperature[] {
    if (this._temperatures.length === 0 && this.weatherData.temperature_2m) {
      this._temperatures = Temperature.fromWeatherDTO(
        this.weatherData,
        this.units
      );
    }

    return this._temperatures;
  }

  get relativeHumidity(): RelativeHumidity[] {
    if (
      this._relativeHumidity.length === 0 &&
      this.weatherData.relative_humidity_2m
    ) {
      this._relativeHumidity = RelativeHumidity.fromWeatherDTO(
        this.weatherData,
        this.units
      );
    }

    return this._relativeHumidity;
  }

  get windSpeed(): WindSpeed[] {
    if (this._windSpeed.length === 0 && this.weatherData.wind_speed_10m) {
      this._windSpeed = WindSpeed.fromWeatherDTO(this.weatherData, this.units);
    }

    return this._windSpeed;
  }

  get characteristics() {
    const characteristics: (
      | Temperature[]
      | RelativeHumidity[]
      | WindSpeed[]
    )[] = [];
    if (this.temperatures.length > 0) {
      characteristics.push(this.temperatures);
    }
    if (this.relativeHumidity.length > 0) {
      characteristics.push(this.relativeHumidity);
    }
    if (this.windSpeed.length > 0) {
      characteristics.push(this.windSpeed);
    }
    return characteristics;
  }

  get days() {
    return this.weatherData.time.map((time) => new Date(time));
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

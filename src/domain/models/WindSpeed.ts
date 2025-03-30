import type {
  SmallWeatherDTO,
  WeatherDTO,
  WeatherUnitsDTO,
} from '@domain/dto/WeatherDTO';
import type { IWeather } from '@domain/interfaces/IWeather';

export class WindSpeed implements IWeather {
  constructor(
    public readonly value: number,
    public readonly units: string,
    public readonly date: Date
  ) {}

  private static validateDTO(dto: SmallWeatherDTO): void {
    if (
      typeof dto.value !== 'number' ||
      dto.value === null ||
      dto.value === undefined ||
      !dto.units ||
      !dto.date
    ) {
      throw new Error('Invalid WindSpeedDTO');
    }
    if (isNaN(Date.parse(dto.date))) {
      throw new Error('Invalid date');
    }
    if (typeof dto.units !== 'string') {
      throw new Error('Invalid units');
    }
  }

  static fromDTO(dto: SmallWeatherDTO): WindSpeed {
    this.validateDTO(dto);

    return new WindSpeed(dto.value, dto.units, new Date(dto.date));
  }

  static fromWeather(weather: IWeather): WindSpeed {
    this.validateDTO({
      value: weather.value,
      units: weather.units,
      date: weather.date.toISOString(),
    });

    return new WindSpeed(weather.value, weather.units, weather.date);
  }

  static fromWeatherDTO(dto: WeatherDTO, units: WeatherUnitsDTO): WindSpeed[] {
    if (!dto.wind_speed_10m || !units.wind_speed_10m) {
      throw new Error('Invalid WeatherDTO');
    }

    return dto.wind_speed_10m.map((speed, index) => {
      const date = new Date(dto.time[index]);
      const unit = units.wind_speed_10m;

      this.validateDTO({
        value: speed,
        units: unit,
        date: dto.time[index],
      });

      return new WindSpeed(speed, unit, date);
    });
  }
}

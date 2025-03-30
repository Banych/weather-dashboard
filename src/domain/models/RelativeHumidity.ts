import type {
  SmallWeatherDTO,
  WeatherDTO,
  WeatherUnitsDTO,
} from '@domain/dto/WeatherDTO';
import type { IWeather } from '@domain/interfaces/IWeather';

export class RelativeHumidity implements IWeather {
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
      throw new Error('Invalid RelativeHumidityDTO');
    }
    if (typeof dto.date !== 'string' || isNaN(Date.parse(dto.date))) {
      throw new Error('Invalid date');
    }
    if (typeof dto.value !== 'number') {
      throw new Error('Invalid value');
    }
  }

  static fromDTO(dto: SmallWeatherDTO): RelativeHumidity {
    this.validateDTO(dto);

    return new RelativeHumidity(dto.value, dto.units, new Date(dto.date));
  }

  static fromWeather(weather: IWeather): RelativeHumidity {
    this.validateDTO({
      value: weather.value,
      units: weather.units,
      date: weather.date.toISOString(),
    });

    return new RelativeHumidity(weather.value, weather.units, weather.date);
  }

  static fromWeatherDTO(
    dto: WeatherDTO,
    units: WeatherUnitsDTO
  ): RelativeHumidity[] {
    if (!dto.relative_humidity_2m || !units.relative_humidity_2m) {
      throw new Error('Invalid WeatherDTO');
    }

    return dto.relative_humidity_2m.map((humidity, index) => {
      const date = new Date(dto.time[index]);
      const unit = units.relative_humidity_2m;

      this.validateDTO({
        value: humidity,
        units: unit,
        date: date.toISOString(),
      });

      return new RelativeHumidity(humidity, unit, date);
    });
  }
}

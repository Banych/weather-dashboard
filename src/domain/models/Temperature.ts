import type {
  SmallWeatherDTO,
  WeatherDTO,
  WeatherUnitsDTO,
} from '@domain/dto/WeatherDTO';
import type { IWeather } from '@domain/interfaces/IWeather';

export class Temperature implements IWeather {
  constructor(
    public readonly value: number,
    public readonly units: '°C' | '°F',
    public readonly date: Date
  ) {}

  private static validateDTO(dto: SmallWeatherDTO): void {
    if (
      dto.value === null ||
      dto.value === undefined ||
      !dto.units ||
      !dto.date
    ) {
      throw new Error('Invalid TemperatureDTO');
    }
    if (typeof dto.value !== 'number' || isNaN(dto.value)) {
      throw new Error('Invalid value');
    }
    if (dto.units !== '°C' && dto.units !== '°F') {
      throw new Error('Invalid units');
    }
    if (isNaN(Date.parse(dto.date))) {
      throw new Error('Invalid date');
    }
  }

  static fromDTO(dto: SmallWeatherDTO): Temperature {
    this.validateDTO(dto);

    return new Temperature(
      dto.value,
      dto.units as '°C' | '°F',
      new Date(dto.date)
    );
  }

  static fromWeather(weather: IWeather): Temperature {
    this.validateDTO({
      value: weather.value,
      units: weather.units,
      date: weather.date.toISOString(),
    });

    return new Temperature(
      weather.value,
      weather.units as '°C' | '°F',
      weather.date
    );
  }

  static fromWeatherDTO(
    dto: WeatherDTO,
    units: WeatherUnitsDTO
  ): Temperature[] {
    if (!dto.temperature_2m || !units.temperature_2m) {
      throw new Error('Invalid WeatherDTO');
    }

    return dto.temperature_2m.map((value, index) => {
      const time = dto.time[index];
      const unit = units.temperature_2m;

      this.validateDTO({
        value,
        units: unit,
        date: time,
      });
      return new Temperature(value, unit as '°C' | '°F', new Date(time));
    });
  }
}

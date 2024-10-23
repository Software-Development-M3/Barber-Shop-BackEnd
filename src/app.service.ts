import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is Appservice  get Hello() func';
  }

  getNow(): string {
    const time = new Date();
    const now = this.getFormatDateTime(time);
    // 11-10-2024T15:32
    
    return "Date = " + now;
  }

  getWeek(): Array<string> {
    const dateArray: string[] = [];
    const time = new Date();

    for (let i = 0; i < 7; i++) {
      const next = new Date(time);
      next.setDate(time.getDate() + i);
      const date = String(next.getDate()).padStart(2, '0');
      const month = String(next.getMonth() + 1).padStart(2, '0');
      const year = next.getFullYear();
      dateArray.push(`${date}-${month}-${year}`);
    }
    
    return dateArray;
  }

  getFormatDateTime(time: Date): string {
    const date = String(time.getDate()).padStart(2, '0');
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const year = time.getFullYear();
    const hour = String(time.getHours()).padStart(2, '0');
    const min = String(time.getMinutes()).padStart(2, '0');
    const formatTime = `${date}-${month}-${year}T${hour}:${min}`;
    return formatTime;
  }

  deformatDateTimeString(datetime: string): Date {
    const [date, time] = datetime.split('T');
    if (!date || !time) {
      throw new BadRequestException();
    }

    const datePart = date.split('-');
    if (datePart.length !== 3) {
      throw new BadRequestException();
    }

    const timePart = time.split(':');
    if (timePart.length !== 2) {
      throw new BadRequestException();
    }

    const day = parseInt(datePart[0], 10);
    const month = parseInt(datePart[1], 10) - 1;
    const year = parseInt(datePart[2], 10);

    const hour = parseInt(timePart[0], 10);
    const minute = parseInt(timePart[1], 10);

    return new Date(year, month, day, hour, minute);
  }

  deformatDateString(date: string): Date {
    const datePart = date.split('-');
    if (datePart.length !== 3) {
      throw new BadRequestException();
    }

    const day = parseInt(datePart[0], 10);
    const month = parseInt(datePart[1], 10) - 1;
    const year = parseInt(datePart[2], 10);

    return new Date(year, month, day);
  }

  deformatTimeString(time: string, initDate: Date=null): Date {
    const [hour, minute] = time.split(':').map(Number);
    const timeObject = new Date(initDate ?? Date.now());
    timeObject.setHours(hour, minute, 0, 0);

    return timeObject;
  }

  getStartEndTime(startTime: string, duration: number): { start: string, end: string, duration: number } {
    const time = this.deformatDateTimeString(startTime);
    const start = this.getFormatDateTime(time);

    time.setMinutes(time.getMinutes() + duration);
    const end = this.getFormatDateTime(time);
    
    return { 
      start: start,
      end: end,
      duration: duration
    };
  }
}

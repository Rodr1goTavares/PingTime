export default class Schedule {
  constructor(name, description, priority, scheduleDateTime, eventDateTime) {
    this.id = Date.now();
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.scheduleDateTime = scheduleDateTime;
    this.eventDateTime = eventDateTime;
  }
}
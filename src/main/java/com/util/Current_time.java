package com.util;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class Current_time {

	public long generate_time() {
		ZonedDateTime indiaTime = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
//        System.out.println("Current time in India: " + indiaTime);
		long millis = indiaTime.toInstant().toEpochMilli();
//        System.out.println("Time in milliseconds: " + millis);
		return millis;
	}
}

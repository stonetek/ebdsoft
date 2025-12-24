package stonetek.com.ebdsoft.util;

import stonetek.com.ebdsoft.dto.dtosespecificos.TrimestreRequest;

import java.time.LocalDate;
import java.time.Month;

public class TrimestreUtils {
    public static TrimestreRequest getCurrentTrimestre() {
        LocalDate today = LocalDate.now();
        Month month = today.getMonth();
        int year = today.getYear();

        String trimestre;
        if (month.getValue() >= 1 && month.getValue() <= 3) {
            trimestre = "1st trimester";
        } else if (month.getValue() >= 4 && month.getValue() <= 6) {
            trimestre = "2nd trimester";
        } else if (month.getValue() >= 7 && month.getValue() <= 9) {
            trimestre = "3rd trimester";
        } else {
            trimestre = "4th trimester";
        }

        return new TrimestreRequest(trimestre, year);
    }
}
package com.toddysoft.ui.modules.lessons.permissions.functions;

import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.Lesson;
import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;

import java.time.LocalDateTime;

public class IsCourseOverFunction implements TermFunction<Boolean> {

    //////////////////////////////////////////////
    // Function methods.
    //////////////////////////////////////////////

    @Override
    public String getName() {
        return "IsCourseOver";
    }

    @Override
    public String getDescription() {
        return "IsCourseOver({course})";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {TermType.OBJECT};
    }

    @Override
    public Term<Boolean> createTerm(Term<?>[] args) {
        return context -> {
            if (!(args[0] instanceof Course course)) {
                return false;
            }

            // If at least one lesson id not over, the course is not over.
            LocalDateTime now = LocalDateTime.now();
            for(Lesson lesson : course.getLessons()) {
                if(lesson.getStartTime().isAfter(now)) {
                    return false;
                }
            }
            return true;
        };
    }

}

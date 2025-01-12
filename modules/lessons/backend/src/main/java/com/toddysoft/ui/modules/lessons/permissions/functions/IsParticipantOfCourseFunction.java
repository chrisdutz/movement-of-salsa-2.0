package com.toddysoft.ui.modules.lessons.permissions.functions;

import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
import com.toddysoft.ui.security.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Configurable;

import java.util.List;

@Configurable(value = "isParticipantOfCourseFunction")
public class IsParticipantOfCourseFunction implements TermFunction<Boolean> {

    private EntityManager entityManager;

    //////////////////////////////////////////////
    // Spring setters.
    //////////////////////////////////////////////

    @PersistenceContext
    public void setEntityManager(final EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    //////////////////////////////////////////////
    // Function methods.
    //////////////////////////////////////////////

    @Override
    public String getName() {
        return "IsParticipantOfCourse";
    }

    @Override
    public String getDescription() {
        return "IsParticipantOfCourse({course})";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {TermType.OBJECT};
    }

    @Override
    public Term<Boolean> createTerm(Term<?>[] args) {
        return context -> {
            if(!(args[0] instanceof Course course)) {
                return false;
            }

            if(context == null) {
                return false;
            }
            final Object userObj = context.get("user");
            if(userObj instanceof User user) {
                // We're the ones putting the courseIds in the context, so we know it's type.
                @SuppressWarnings("unchecked")
                List<Long> courseIds = (List<Long>) context.get("courseIds");
                if(courseIds == null) {
                    courseIds = entityManager.createQuery("SELECT DISTINCT course.id FROM Couple couple " +
                                    "LEFT JOIN FETCH couple.course course WHERE couple.gent = :user OR couple.lady = :user",
                            Long.class).setParameter("user", user).getResultList();
                    context.put("courseIds", courseIds);
                }
                return courseIds.contains(course.getId());
            }

            return false;
        };
    }

}

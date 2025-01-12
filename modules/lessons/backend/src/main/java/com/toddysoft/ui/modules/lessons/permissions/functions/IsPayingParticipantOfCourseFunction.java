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

@Configurable(value = "isPayingParticipantOfCourseFunction")
public class IsPayingParticipantOfCourseFunction implements TermFunction<Boolean> {

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
        return "IsPayingParticipantOfCourse";
    }

    @Override
    public String getDescription() {
        return "IsPayingParticipantOfCourse({course})";
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
                // We're the ones putting the registrationIds in the context, so we know it's type.
                @SuppressWarnings("unchecked")
                List<Long> registrationIds = (List<Long>) context.get("registrationIds");
                if(registrationIds == null) {
                    registrationIds = entityManager.createQuery("SELECT DISTINCT course.id FROM CourseRegistration registration " +
                                    "LEFT JOIN FETCH registration.course course WHERE " +
                                    "registration.registrar = :user OR registration.partner = :user",
                            Long.class).setParameter("user", user).getResultList();
                    context.put("registrationIds", registrationIds);
                }
                return registrationIds.contains(course.getId());
            }

            return false;
        };
    }

}

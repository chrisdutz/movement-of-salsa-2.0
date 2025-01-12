package com.toddysoft.ui.modules.lessons;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LessonsModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                new FrontendModule("Main", "Lessons", "fa-people", "/lessons", "/modules/lessons/assets/lessonsModule.js", "LessonsMainModule", 30),
                new FrontendModule("User", "Lessons", "fa-people", "/user/lessons", "/modules/lessons/assets/lessonsModule.js", "LessonsUserModule", 30),
                new FrontendModule("Admin", "Lessons", "fa-people", "/admin/lessons", "/modules/lessons/assets/lessonsModule.js", "LessonsAdminModule", 40),
                new FrontendModule("Admin", "Lesson Types", "fa-list", "/admin/lesson-types", "/modules/lessons/assets/lessonsModule.js", "LessonTypesAdminModule", 30));
    }

}

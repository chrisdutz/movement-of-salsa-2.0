package com.toddysoft.ui.modules.gallery;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GalleryModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                new FrontendModule("Main", "Gallery", "fa-camera", "/gallery", "/modules/gallery/assets/galleryModule.js", "GalleryMainModule", 40),
                new FrontendModule("Admin", "Gallery", "fa-camera", "/admin/gallery", "/modules/gallery/assets/galleryModule.js", "GalleryAdminModule", 80));
    }

}

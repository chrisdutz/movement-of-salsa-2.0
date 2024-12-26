package com.toddysoft.ui.utils.codegen;

import cz.habarta.typescript.generator.compiler.ModelCompiler;
import cz.habarta.typescript.generator.ext.AxiosClientExtension;

import java.util.List;

public class GenericInterfaceWorkaroundExtension extends AxiosClientExtension {

    public List<TransformerDefinition> getTransformers() {
        return List.of(new TransformerDefinition(ModelCompiler.TransformationPhase.BeforeTsModel, new Transformer()));
    }

}
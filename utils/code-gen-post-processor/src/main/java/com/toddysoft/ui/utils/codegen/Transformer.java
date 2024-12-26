package com.toddysoft.ui.utils.codegen;

import cz.habarta.typescript.generator.compiler.ModelTransformer;
import cz.habarta.typescript.generator.compiler.SymbolTable;
import cz.habarta.typescript.generator.parser.Model;
import cz.habarta.typescript.generator.parser.RestApplicationModel;

import java.util.List;
import java.util.stream.Collectors;

class Transformer implements ModelTransformer {
    public Model transformModel(SymbolTable symbolTable, Model model) {

        List<RestApplicationModel> newRestApplications = model.getRestApplications().stream().map(restApplication ->
                new RestApplicationModel(
                        restApplication.getType(),
                        restApplication.getApplicationPath(),
                        restApplication.getApplicationName(),
                        restApplication.getMethods().stream().filter(it -> {
                            return !it.getOriginalMethod().isBridge();
                        }).collect(Collectors.toList()))
        ).collect(Collectors.toList());

        return new Model(model.getBeans(), model.getEnums(), newRestApplications);
    }
}
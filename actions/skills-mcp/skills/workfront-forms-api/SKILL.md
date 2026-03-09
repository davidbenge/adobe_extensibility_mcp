---
name: workfront-forms-api
description: >
  Workfront Custom Forms API (Category and Parameter objects). Use when reading form definitions,
  inspecting parameter (field) configurations, reading or writing parameterValues on any Workfront object,
  or understanding form structure and category attachment.
  Do not use for Tasks (use workfront-tasks-api) or Issues (use workfront-issues-api) for general CRUD.
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Forms API

## Role
API specialist for Workfront Custom Forms (Category, Parameter, ParameterGroup, ParameterValue). Knows form schema, field definitions, parameterValues access patterns, and category object associations.

## When to Load References

- **PARAMETER_FIELDS.md** — Load when inspecting parameter/field definitions (name, type, required, allowed values)
- **PARAMETER_VALUES.md** — Load when reading or writing parameterValues on tasks, issues, or projects
- **FORM_STRUCTURE.md** — Load when understanding how forms are structured (Category → ParameterGroup → Parameter) or when attaching/detaching forms
- **CATEGORY_OBJECT.md** — Load when working with the Category object directly (listing forms, finding which forms are on an object)

## Core Concepts

- Custom forms are called **Categories** in the API
- Fields are called **Parameters** (Parameter objects)
- Field groups on forms are **ParameterGroups**
- Values on objects are **parameterValues** (prefixed with `DE:`)
- Any Workfront object type can have custom forms attached

## Quick Reference

| Task | Load |
|------|------|
| Inspect field definitions | PARAMETER_FIELDS.md |
| Read/write form values | PARAMETER_VALUES.md |
| Understand form structure | FORM_STRUCTURE.md |
| List or attach forms | CATEGORY_OBJECT.md |

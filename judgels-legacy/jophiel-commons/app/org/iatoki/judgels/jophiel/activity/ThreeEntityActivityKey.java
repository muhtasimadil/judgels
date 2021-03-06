package org.iatoki.judgels.jophiel.activity;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.Map;

public abstract class ThreeEntityActivityKey implements ActivityKey {

    private String entity;

    private String entityJid;

    private String entityName;

    private String refEntity;

    private String refEntityJid;

    private String refEntityName;

    private String refRefEntity;

    private String refRefEntityJid;

    private String refRefEntityName;

    public final ActivityKey construct(String refRefEntity, String refRefEntityJid, String refRefEntityName, String refEntity, String refEntityJid, String refEntityName, String entity, String entityJid, String entityName) {
        this.refRefEntity = refRefEntity;
        this.refRefEntityJid = refRefEntityJid;
        this.refRefEntityName = refRefEntityName;
        this.refEntity = refEntity;
        this.refEntityJid = refEntityJid;
        this.refEntityName = refEntityName;
        this.entity = entity;
        this.entityJid = entityJid;
        this.entityName = entityName;

        return this;
    }

    public String getEntity() {
        return entity;
    }

    public String getEntityJid() {
        return entityJid;
    }

    public String getEntityName() {
        return entityName;
    }

    public String getRefEntity() {
        return refEntity;
    }

    public String getRefEntityJid() {
        return refEntityJid;
    }

    public String getRefEntityName() {
        return refEntityName;
    }

    public String getRefRefEntity() {
        return refRefEntity;
    }

    public String getRefRefEntityJid() {
        return refRefEntityJid;
    }

    public String getRefRefEntityName() {
        return refRefEntityName;
    }

    @Override
    public String toJsonString() {
        return new Gson().toJson(this, ThreeEntityActivityKey.class);
    }

    @Override
    public ActivityKey fromJson(String json) {
        Map<String, String> fields = new Gson().fromJson(json, new TypeToken<Map<String, String>>() { }.getType());

        return this.construct(fields.get("refRefEntity"), fields.get("refRefEntityJid"), fields.get("refRefEntityName"), fields.get("refEntity"), fields.get("refEntityJid"), fields.get("refEntityName"), fields.get("entity"), fields.get("entityJid"), fields.get("entityName"));
    }
}

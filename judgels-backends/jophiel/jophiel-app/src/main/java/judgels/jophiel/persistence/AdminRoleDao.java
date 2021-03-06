package judgels.jophiel.persistence;

import judgels.persistence.UnmodifiableDao;

public interface AdminRoleDao extends UnmodifiableDao<AdminRoleModel> {
    boolean isAdmin(String userJid);
}

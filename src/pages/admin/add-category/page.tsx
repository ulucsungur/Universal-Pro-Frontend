import { CategoryForm } from '../../../components/admin/CategoryForm';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { useTranslation } from 'react-i18next';

export default function AddCategoryPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 transition-colors duration-500 bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
      <AuthLayout
        title={t('admin_cat_title')}
        subtitle={t('admin_cat_subtitle')}
      >
        <CategoryForm />
      </AuthLayout>
    </div>
  );
}

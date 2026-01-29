import { CategoryForm } from '../../../components/admin/CategoryForm';
import { AuthLayout } from '../../../components/auth/AuthLayout';

export default function AddCategoryPage() {
  return (
    <AuthLayout title="KATEGORİ" subtitle="Market Hiyerarşisini Yönetin">
      <CategoryForm />
    </AuthLayout>
  );
}

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useResources, useCreateResource } from '../lib/hooks';

function Resources() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');

  const { data: resources = [], isLoading, error, refetch } = useResources();
  const createMutation = useCreateResource();

  const isAdmin = user?.role === 'TENANT_ADMIN';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceName.trim()) return;

    try {
      await createMutation.mutateAsync(newResourceName.trim());
      setNewResourceName('');
      setShowForm(false);
      // Cache is automatically invalidated by React Query, data will refetch
    } catch (err) {
      // Error handled by useMutation hook
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading resources..." />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)} variant="primary">
            {showForm ? 'Cancel' : 'Create Resource'}
          </Button>
        )}
      </div>

      {error && <ErrorMessage message={error.message} onClose={() => refetch()} />}
      {createMutation.error && (
        <ErrorMessage message={createMutation.error.message} onClose={() => createMutation.reset()} />
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="flex gap-4 mb-8 p-6 bg-white rounded-lg shadow">
          <div className="flex-1">
            <Input
              type="text"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              placeholder="Resource name"
              required
              disabled={createMutation.isPending}
              className="mb-0"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              isLoading={createMutation.isPending}
              variant="primary"
            >
              Create
            </Button>
          </div>
        </form>
      )}

      {!resources || resources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-2">No resources found.</p>
          {isAdmin && <p className="text-gray-500">Create your first resource to get started.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.name}</h3>
              <p className="text-sm text-gray-500">ID: {resource.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;

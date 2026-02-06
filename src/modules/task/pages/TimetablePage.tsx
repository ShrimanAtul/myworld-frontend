import React, { useState } from 'react';
import { Button, Spinner } from '@shared/components';
import {
  useTimetables,
  useCreateTimetable,
  useUpdateTimetable,
  useDeleteTimetable,
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@shared/hooks/useTimetables';
import { Timetable, TimetableType, DayOfWeek, TimetableCollection, DAY_PRESETS } from '@shared/types/timetable';

const TimetablePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | undefined>();
  const [editingCollection, setEditingCollection] = useState<TimetableCollection | undefined>();
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([DayOfWeek.MONDAY]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const { data: timetables = [], isLoading: timetablesLoading } = useTimetables();
  const { data: collections = [], isLoading: collectionsLoading, error } = useCollections();
  const createTimetable = useCreateTimetable();
  const updateTimetable = useUpdateTimetable();
  const deleteTimetable = useDeleteTimetable();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const defaultCollection = collections.find((c) => c.isDefault);

  const toggleCollection = (id: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCollections(newExpanded);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePreset = (preset: 'ALL' | 'WEEKDAYS' | 'WEEKENDS') => {
    setSelectedDays(DAY_PRESETS[preset]);
  };

  const handleCollectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      isDefault: formData.get('isDefault') === 'on',
      isAiGenerated: false,
    };

    try {
      if (editingCollection) {
        await updateCollection.mutateAsync({ id: editingCollection.id, data });
      } else {
        const created = await createCollection.mutateAsync(data);
        setSelectedCollectionId(created.id);
      }
      setIsCollectionFormOpen(false);
      setEditingCollection(undefined);
    } catch (err) {
      console.error('Failed to save collection:', err);
    }
  };

  const handleTimetableSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const collId = selectedCollectionId || defaultCollection?.id;
    if (!collId) {
      alert('Please create a collection first');
      return;
    }

    const data = {
      collectionId: collId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as TimetableType,
      daysOfWeek: selectedDays,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };

    try {
      if (editingTimetable) {
        await updateTimetable.mutateAsync({ id: editingTimetable.id, data });
      } else {
        await createTimetable.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingTimetable(undefined);
      setSelectedDays([DayOfWeek.MONDAY]);
    } catch (err) {
      console.error('Failed to save timetable:', err);
    }
  };

  const handleDeleteTimetable = async (id: string) => {
    if (window.confirm('Delete this entry?')) {
      try {
        await deleteTimetable.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete timetable:', err);
      }
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (window.confirm('Delete this collection and all its entries?')) {
      try {
        await deleteCollection.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete collection:', err);
      }
    }
  };

  const getCollectionTimetables = (collectionId: string) =>
    timetables.filter((t) => t.collectionId === collectionId);

  if (collectionsLoading || timetablesLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Failed to load timetables. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Manage your weekly schedules</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsCollectionFormOpen(true)}>
            + New Collection
          </Button>
          <Button
            onClick={() => {
              setEditingTimetable(undefined);
              setIsFormOpen(true);
              setSelectedCollectionId(defaultCollection?.id || null);
            }}
          >
            + New Entry
          </Button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timetable collections yet</h3>
          <p className="text-gray-600 mb-4">Create your first timetable collection!</p>
          <Button onClick={() => setIsCollectionFormOpen(true)}>Create Collection</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => {
            const collectionTimetables = getCollectionTimetables(collection.id);
            const isExpanded = expandedCollections.has(collection.id) || collection.isDefault;

            return (
              <div key={collection.id} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                      {collection.isDefault && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                      {collection.isAiGenerated && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          AI Generated
                        </span>
                      )}
                    </div>
                    {collection.description && (
                      <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{collectionTimetables.length} entries</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!collection.isDefault && !collection.isAiGenerated && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCollection(collection);
                            setIsCollectionFormOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {!collection.isDefault && (
                      <button
                        onClick={() => toggleCollection(collection.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm ml-2"
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4">
                    {collectionTimetables.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No entries in this collection</p>
                    ) : (
                      <div className="space-y-3">
                        {collectionTimetables.map((entry) => (
                          <div key={entry.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-600">
                                    {entry.startTime} - {entry.endTime}
                                  </span>
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                    {entry.type}
                                  </span>
                                </div>
                                <h4 className="text-base font-semibold text-gray-900 mt-1">{entry.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {entry.daysOfWeek.join(', ')}
                                </p>
                                {entry.description && (
                                  <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingTimetable(entry);
                                    setSelectedDays(entry.daysOfWeek);
                                    setSelectedCollectionId(entry.collectionId);
                                    setIsFormOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTimetable(entry.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Collection Form Modal */}
      {isCollectionFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingCollection ? 'Edit Collection' : 'New Collection'}
            </h2>
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCollection?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingCollection?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  defaultChecked={editingCollection?.isDefault}
                  className="mr-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default view
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={createCollection.isPending || updateCollection.isPending}
                >
                  {editingCollection ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCollectionFormOpen(false);
                    setEditingCollection(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timetable Entry Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingTimetable ? 'Edit Timetable Entry' : 'New Timetable Entry'}
            </h2>
            <form onSubmit={handleTimetableSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingTimetable?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingTimetable?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  required
                  defaultValue={editingTimetable?.type || TimetableType.OTHER}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(TimetableType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handlePreset('ALL')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    All Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset('WEEKDAYS')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Weekdays
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset('WEEKENDS')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Weekends
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(DayOfWeek).map((day) => (
                    <label key={day} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="mr-2"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    defaultValue={editingTimetable?.startTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    defaultValue={editingTimetable?.endTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={createTimetable.isPending || updateTimetable.isPending}
                >
                  {editingTimetable ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTimetable(undefined);
                    setSelectedDays([DayOfWeek.MONDAY]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;

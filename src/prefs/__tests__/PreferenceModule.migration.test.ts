import { UserPreferenceModule, MIGRATION_FLAG } from '../PreferenceModule';

describe('UserPreferenceModule migration', () => {
  let syncGetMock: jest.Mock;
  let localGetMock: jest.Mock;
  let localSetMock: jest.Mock;

  beforeEach(() => {
    syncGetMock = jest.fn((keys, cb) => cb({ autoSubmit: false, theme: 'dark' }));
    localGetMock = jest.fn((keys, cb) => cb({}));
    localSetMock = jest.fn((items, cb) => cb());

    global.chrome = {
      storage: {
        sync: { get: syncGetMock },
        local: { get: localGetMock, set: localSetMock },
      },
      runtime: { lastError: null },
    } as any;

    // Reset singleton instance
    (UserPreferenceModule as any).instance = undefined;
  });

  it('migrates sync preferences to local and sets migration flag', async () => {
    const module = UserPreferenceModule.getInstance();
    // Wait for migration promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    // sync.get should be called to retrieve sync preferences
    expect(syncGetMock).toHaveBeenCalledWith(expect.arrayContaining([ 'autoSubmit', 'theme' ]), expect.any(Function));

    // local.set should be called first for migrating preferences
    expect(localSetMock).toHaveBeenNthCalledWith(1, { autoSubmit: false, theme: 'dark' }, expect.any(Function));
    // then for setting migration flag
    expect(localSetMock).toHaveBeenNthCalledWith(2, { [MIGRATION_FLAG]: true }, expect.any(Function));
  });

  it('does not migrate again if migration flag is already set', async () => {
    // Simulate migration flag present in local storage
    localGetMock.mockImplementation((keys, cb) => cb({ [MIGRATION_FLAG]: true }));

    const module = UserPreferenceModule.getInstance();
    await new Promise(resolve => setImmediate(resolve));

    // sync.get should not be called
    expect(syncGetMock).not.toHaveBeenCalled();
    // local.set should not be called for migration
    expect(localSetMock).not.toHaveBeenCalled();
  });
}); 
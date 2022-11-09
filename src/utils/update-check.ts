import pc from 'picocolors';
import updateCheck from 'update-check';

let didCheckForUpdate = false;

export async function checkForUpdates(manifest: Record<string, unknown>) {
  if (didCheckForUpdate) return;

  try {
    const result = await updateCheck(manifest);
    if (result) {
      console.log(
        '\n',
        pc.bgRed(pc.bold(' UPDATE ')),
        `📦 Update available for ${pc.bold('soccer-go')}: ${
          manifest.version
        } → ${result.latest}\n`
      );
    }
  } catch {
    // Don't do anything
  } finally {
    didCheckForUpdate = true;
  }
}

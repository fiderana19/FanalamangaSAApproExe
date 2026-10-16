import { useEffect, useState } from "react";
import { useUpdater } from "@/hooks/useUpdater";
import UpdateNotice from "@/components/common/UpdateNotice";
import UpdateDownloadPage from "@/components/common/UpdateDownloadPage";

const INSTALL_DELAY_MS = 1200;

const UpdateManager = () => {
  const { status, info, progress, error, download, retry, install } = useUpdater();
  const [dismissed, setDismissed] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);
  const [appVersion, setAppVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "available") {
      setDismissed(false);
    }
  }, [status]);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.getAppVersion) return;
    api
      .getAppVersion()
      .then((version) => setAppVersion(version))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (status === "downloaded") {
      const timer = setTimeout(() => {
        install();
      }, INSTALL_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [status, install]);

  const handleUpdate = () => {
    setPageOpen(true);
    download();
  };

  return (
    <>
      <UpdateNotice
        visible={status === "available" && !dismissed && !pageOpen}
        version={info.version}
        onUpdate={handleUpdate}
        onLater={() => setDismissed(true)}
      />
      <UpdateDownloadPage
        open={pageOpen}
        status={status}
        info={info}
        progress={progress}
        error={error}
        appVersion={appVersion}
        onRetry={retry}
      />
    </>
  );
};

export default UpdateManager;

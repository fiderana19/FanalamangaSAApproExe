import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const LoginPage = lazy(() => import("@/pages/Auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/Auth/ForgotPasswordPage"));
const Unauthorized = lazy(() => import("@/pages/Errors/Unauthorized"));
const NotFound = lazy(() => import("@/pages/Errors/NotFound"));

/* admin */
const AdminHomePage = lazy(() => import("@/pages/Admin/HomePage"));
const ServicesPage = lazy(() => import("@/pages/Admin/ServicesPage"));
const ServiceCreatePage = lazy(() => import("@/pages/Admin/ServiceCreatePage"));
const ServiceEditPage = lazy(() => import("@/pages/Admin/ServiceEditPage"));
const ServiceViewPage = lazy(() => import("@/pages/Admin/ServiceViewPage"));
const ResponsabilitesPage = lazy(() => import("@/pages/Admin/ResponsabilitesPage"));
const ResponsabiliteCreatePage = lazy(() => import("@/pages/Admin/ResponsabiliteCreatePage"));
const ResponsabiliteEditPage = lazy(() => import("@/pages/Admin/ResponsabiliteEditPage"));
const ResponsabiliteViewPage = lazy(() => import("@/pages/Admin/ResponsabiliteViewPage"));
const ComptesPage = lazy(() => import("@/pages/Admin/ComptesPage"));
const CompteCreatePage = lazy(() => import("@/pages/Admin/CompteCreatePage"));
const CompteEditPage = lazy(() => import("@/pages/Admin/CompteEditPage"));
const CompteViewPage = lazy(() => import("@/pages/Admin/CompteViewPage"));
const AdminProfilePage = lazy(() => import("@/pages/Admin/ProfilePage"));
const AdminChangePasswordPage = lazy(() => import("@/pages/Admin/ChangePasswordPage"));
const AdminAidePage = lazy(() => import("@/pages/Admin/AidePage"));
const AdminParametresPage = lazy(() => import("@/pages/Admin/ParametresPage"));

/* employe */
const EmployeHomePage = lazy(() => import("@/pages/Employe/HomePage"));
const DemandesPage = lazy(() => import("@/pages/Employe/DemandesPage"));
const DemandeCreatePage = lazy(() => import("@/pages/Employe/DemandeCreatePage"));
const DemandeEditPage = lazy(() => import("@/pages/Employe/DemandeEditPage"));
const DemandeViewPage = lazy(() => import("@/pages/Employe/DemandeViewPage"));
const BonMagasinCreatePage = lazy(() => import("@/pages/Employe/BonMagasinCreatePage"));
const EmployeBonsMagasinPage = lazy(() => import("@/pages/Employe/BonsMagasinPage"));
const EmployeBonMagasinViewPage = lazy(() => import("@/pages/Employe/BonMagasinViewPage"));
const EmployeApprovisionnementsPage = lazy(() => import("@/pages/Employe/ApprovisionnementsPage"));
const EmployeApprovisionnementViewPage = lazy(() => import("@/pages/Employe/ApprovisionnementViewPage"));
const EmployeLivraisonsPage = lazy(() => import("@/pages/Employe/LivraisonsPage"));
const EmployeLivraisonViewPage = lazy(() => import("@/pages/Employe/LivraisonViewPage"));
const EmployeReceptionCreatePage = lazy(() => import("@/pages/Employe/ReceptionCreatePage"));
const EmployeLivraisonScanPage = lazy(() => import("@/pages/Employe/LivraisonScanPage"));
const EmployeProfilePage = lazy(() => import("@/pages/Employe/ProfilePage"));
const EmployeChangePasswordPage = lazy(() => import("@/pages/Employe/ChangePasswordPage"));
const EmployeAidePage = lazy(() => import("@/pages/Employe/AidePage"));

/* chef_service */
const ChefServiceHomePage = lazy(() => import("@/pages/ChefService/HomePage"));
const ChefServiceDemandesPage = lazy(() => import("@/pages/ChefService/DemandesPage"));
const ChefServiceDemandeViewPage = lazy(() => import("@/pages/ChefService/DemandeViewPage"));
const ChefServiceDemandeValiderPage = lazy(() => import("@/pages/ChefService/DemandeValiderPage"));
const ChefServiceBonsMagasinPage = lazy(() => import("@/pages/ChefService/BonsMagasinPage"));
const ChefServiceBonMagasinViewPage = lazy(() => import("@/pages/ChefService/BonMagasinViewPage"));
const ChefServiceApprovisionnementsPage = lazy(() => import("@/pages/ChefService/ApprovisionnementsPage"));
const ChefServiceApprovisionnementViewPage = lazy(() => import("@/pages/ChefService/ApprovisionnementViewPage"));
const ChefServiceLivraisonsPage = lazy(() => import("@/pages/ChefService/LivraisonsPage"));
const ChefServiceLivraisonViewPage = lazy(() => import("@/pages/ChefService/LivraisonViewPage"));
const ChefServiceProfilePage = lazy(() => import("@/pages/ChefService/ProfilePage"));
const ChefServiceChangePasswordPage = lazy(() => import("@/pages/ChefService/ChangePasswordPage"));
const ChefServiceAidePage = lazy(() => import("@/pages/ChefService/AidePage"));

/* controleur_gestion */
const ControleurHomePage = lazy(() => import("@/pages/ControleurGestion/HomePage"));
const ControleurDemandesPage = lazy(() => import("@/pages/ControleurGestion/DemandesPage"));
const ControleurDemandeViewPage = lazy(() => import("@/pages/ControleurGestion/DemandeViewPage"));
const ControleurDemandeControlePage = lazy(() => import("@/pages/ControleurGestion/DemandeControlePage"));
const ControleurHistoriquePage = lazy(() => import("@/pages/ControleurGestion/HistoriqueControlesPage"));
const ControleurControleViewPage = lazy(() => import("@/pages/ControleurGestion/ControleViewPage"));
const ControleurProfilePage = lazy(() => import("@/pages/ControleurGestion/ProfilePage"));
const ControleurChangePasswordPage = lazy(() => import("@/pages/ControleurGestion/ChangePasswordPage"));
const ControleurAidePage = lazy(() => import("@/pages/ControleurGestion/AidePage"));

/* agent_appro */
const AgentApproHomePage = lazy(() => import("@/pages/AgentAppro/HomePage"));
const RessourcesPage = lazy(() => import("@/pages/AgentAppro/RessourcesPage"));
const RessourceCreatePage = lazy(() => import("@/pages/AgentAppro/RessourceCreatePage"));
const RessourceEditPage = lazy(() => import("@/pages/AgentAppro/RessourceEditPage"));
const RessourceViewPage = lazy(() => import("@/pages/AgentAppro/RessourceViewPage"));
const RessourceImportPage = lazy(() => import("@/pages/AgentAppro/RessourceImportPage"));
const AgentApproBonsMagasinPage = lazy(() => import("@/pages/AgentAppro/BonsMagasinPage"));
const AgentApproBonMagasinViewPage = lazy(() => import("@/pages/AgentAppro/BonMagasinViewPage"));
const AgentApproApprovisionnementsPage = lazy(() => import("@/pages/AgentAppro/ApprovisionnementsPage"));
  const AgentApproApprovisionnementViewPage = lazy(() => import("@/pages/AgentAppro/ApprovisionnementViewPage"));
  const AgentApproVerificationStockPage = lazy(() => import("@/pages/AgentAppro/ApprovisionnementVerificationStockPage"));
const BonSortieCreatePage = lazy(() => import("@/pages/AgentAppro/BonSortieCreatePage"));
const BonSortieViewPage = lazy(() => import("@/pages/AgentAppro/BonSortieViewPage"));
const AgentApproBonsSortiePage = lazy(() => import("@/pages/AgentAppro/BonsSortiePage"));
const AgentApproLivraisonsPage = lazy(() => import("@/pages/AgentAppro/LivraisonsPage"));
const AgentApproLivraisonViewPage = lazy(() => import("@/pages/AgentAppro/LivraisonViewPage"));
const AgentApproDemandeAchatsPage = lazy(() => import("@/pages/AgentAppro/DemandeAchatsPage"));
const AgentApproDemandeAchatCreatePage = lazy(() => import("@/pages/AgentAppro/DemandeAchatCreatePage"));
const AgentApproDemandeAchatViewPage = lazy(() => import("@/pages/AgentAppro/DemandeAchatViewPage"));
const AgentApproProfilePage = lazy(() => import("@/pages/AgentAppro/ProfilePage"));
const AgentApproChangePasswordPage = lazy(() => import("@/pages/AgentAppro/ChangePasswordPage"));
const AgentApproAidePage = lazy(() => import("@/pages/AgentAppro/AidePage"));
const AgentApproHistoriquePage = lazy(() => import("@/pages/AgentAppro/HistoriquePage"));
const AgentApproHistoriqueDemandePage = lazy(() => import("@/pages/AgentAppro/HistoriqueTraitementsDemandePage"));
const AgentApproHistoriqueApproPage = lazy(() => import("@/pages/AgentAppro/HistoriqueTraitementsApproPage"));
const AgentApproHistoriqueAchatPage = lazy(() => import("@/pages/AgentAppro/HistoriqueStatutsAchatPage"));

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const EmployeLayout = lazy(() => import("@/layouts/EmployeLayout"));
const ChefServiceLayout = lazy(() => import("@/layouts/ChefServiceLayout"));
const ControleurGestionLayout = lazy(() => import("@/layouts/ControleurGestionLayout"));
const AgentApproLayout = lazy(() => import("@/layouts/AgentApproLayout"));
const RoleBasedRoute = lazy(() => import("@/routes/RoleBasedRoute"));

function App() {
  const fallback = <div className='text-center my-10'><LoadingOutlined className='text-5xl' /></div>;

  return (
      <Routes>
        {/* Public routes */}
        <Route index path="/" element={
          <Suspense fallback={fallback}>
            <LoginPage />
          </Suspense>} />
        <Route path="/forgot-password" element={
          <Suspense fallback={fallback}>
            <ForgotPasswordPage />
          </Suspense>} />
        <Route path="/unauthorized" element={
          <Suspense fallback={fallback}>
            <Unauthorized />
          </Suspense>} />
        <Route path="*" element={
          <Suspense fallback={fallback}>
            <NotFound />
          </Suspense>} />
        {/* Role routes */}
        <Route path="/admin" element={
          <Suspense fallback={fallback}>
            <RoleBasedRoute allowedRoles={["admin"]} />
          </Suspense>}>
          <Route element={<AdminLayout />}>
            <Route index element={
              <Suspense fallback={fallback}>
                <AdminHomePage />
              </Suspense>} />
            <Route path="service" element={
              <Suspense fallback={fallback}>
                <ServicesPage />
              </Suspense>} />
            <Route path="service/create" element={
              <Suspense fallback={fallback}>
                <ServiceCreatePage />
              </Suspense>} />
            <Route path="service/edit/:id" element={
              <Suspense fallback={fallback}>
                <ServiceEditPage />
              </Suspense>} />
            <Route path="service/view/:id" element={
              <Suspense fallback={fallback}>
                <ServiceViewPage />
              </Suspense>} />
            <Route path="responsabilite" element={
              <Suspense fallback={fallback}>
                <ResponsabilitesPage />
              </Suspense>} />
            <Route path="responsabilite/create" element={
              <Suspense fallback={fallback}>
                <ResponsabiliteCreatePage />
              </Suspense>} />
            <Route path="responsabilite/edit/:id" element={
              <Suspense fallback={fallback}>
                <ResponsabiliteEditPage />
              </Suspense>} />
            <Route path="responsabilite/view/:id" element={
              <Suspense fallback={fallback}>
                <ResponsabiliteViewPage />
              </Suspense>} />
            <Route path="compte" element={
              <Suspense fallback={fallback}>
                <ComptesPage />
              </Suspense>} />
            <Route path="compte/create" element={
              <Suspense fallback={fallback}>
                <CompteCreatePage />
              </Suspense>} />
            <Route path="compte/edit/:id" element={
              <Suspense fallback={fallback}>
                <CompteEditPage />
              </Suspense>} />
            <Route path="compte/view/:id" element={
              <Suspense fallback={fallback}>
                <CompteViewPage />
              </Suspense>} />
            <Route path="aide" element={
              <Suspense fallback={fallback}>
                <AdminAidePage />
              </Suspense>} />
            <Route path="profil" element={
              <Suspense fallback={fallback}>
                <AdminProfilePage />
              </Suspense>} />
            <Route path="profil/mot-de-passe" element={
              <Suspense fallback={fallback}>
                <AdminChangePasswordPage />
              </Suspense>} />
            <Route path="parametres" element={
              <Suspense fallback={fallback}>
                <AdminParametresPage />
              </Suspense>} />
          </Route>
        </Route>
        <Route path="/employe" element={
          <Suspense fallback={fallback}>
            <RoleBasedRoute allowedRoles={["employe"]} />
          </Suspense>}>
          <Route element={<EmployeLayout />}>
            <Route index element={
              <Suspense fallback={fallback}>
                <EmployeHomePage />
              </Suspense>} />
            <Route path="demande" element={
              <Suspense fallback={fallback}>
                <DemandesPage />
              </Suspense>} />
            <Route path="demande/create" element={
              <Suspense fallback={fallback}>
                <DemandeCreatePage />
              </Suspense>} />
            <Route path="demande/edit/:id" element={
              <Suspense fallback={fallback}>
                <DemandeEditPage />
              </Suspense>} />
            <Route path="demande/view/:id" element={
              <Suspense fallback={fallback}>
                <DemandeViewPage />
              </Suspense>} />
            <Route path="demande/bon-magasin/:id" element={
              <Suspense fallback={fallback}>
                <BonMagasinCreatePage />
              </Suspense>} />
            <Route path="bon-magasin" element={
              <Suspense fallback={fallback}>
                <EmployeBonsMagasinPage />
              </Suspense>} />
            <Route path="bon-magasin/view/:id" element={
              <Suspense fallback={fallback}>
                <EmployeBonMagasinViewPage />
              </Suspense>} />
            <Route path="approvisionnement" element={
              <Suspense fallback={fallback}>
                <EmployeApprovisionnementsPage />
              </Suspense>} />
            <Route path="approvisionnement/view/:id" element={
              <Suspense fallback={fallback}>
                <EmployeApprovisionnementViewPage />
              </Suspense>} />
            <Route path="livraison" element={
              <Suspense fallback={fallback}>
                <EmployeLivraisonsPage />
              </Suspense>} />
            <Route path="livraison/view/:id" element={
              <Suspense fallback={fallback}>
                <EmployeLivraisonViewPage />
              </Suspense>} />
            <Route path="livraison/reception/:id" element={
              <Suspense fallback={fallback}>
                <EmployeReceptionCreatePage />
              </Suspense>} />
            <Route path="livraison/scan" element={
              <Suspense fallback={fallback}>
                <EmployeLivraisonScanPage />
              </Suspense>} />
            <Route path="aide" element={
              <Suspense fallback={fallback}>
                <EmployeAidePage />
              </Suspense>} />
            <Route path="profil" element={
              <Suspense fallback={fallback}>
                <EmployeProfilePage />
              </Suspense>} />
            <Route path="profil/mot-de-passe" element={
              <Suspense fallback={fallback}>
                <EmployeChangePasswordPage />
              </Suspense>} />
          </Route>
        </Route>
        <Route path="/chef_service" element={
          <Suspense fallback={fallback}>
            <RoleBasedRoute allowedRoles={["chef_service"]} />
          </Suspense>}>
          <Route element={<ChefServiceLayout />}>
            <Route index element={
              <Suspense fallback={fallback}>
                <ChefServiceHomePage />
              </Suspense>} />
            <Route path="demande" element={
              <Suspense fallback={fallback}>
                <ChefServiceDemandesPage />
              </Suspense>} />
            <Route path="demande/view/:id" element={
              <Suspense fallback={fallback}>
                <ChefServiceDemandeViewPage />
              </Suspense>} />
            <Route path="demande/valider/:id" element={
              <Suspense fallback={fallback}>
                <ChefServiceDemandeValiderPage />
              </Suspense>} />
            <Route path="bon-magasin" element={
              <Suspense fallback={fallback}>
                <ChefServiceBonsMagasinPage />
              </Suspense>} />
            <Route path="bon-magasin/view/:id" element={
              <Suspense fallback={fallback}>
                <ChefServiceBonMagasinViewPage />
              </Suspense>} />
            <Route path="approvisionnement" element={
              <Suspense fallback={fallback}>
                <ChefServiceApprovisionnementsPage />
              </Suspense>} />
            <Route path="approvisionnement/view/:id" element={
              <Suspense fallback={fallback}>
                <ChefServiceApprovisionnementViewPage />
              </Suspense>} />
            <Route path="livraison" element={
              <Suspense fallback={fallback}>
                <ChefServiceLivraisonsPage />
              </Suspense>} />
            <Route path="livraison/view/:id" element={
              <Suspense fallback={fallback}>
                <ChefServiceLivraisonViewPage />
              </Suspense>} />
            <Route path="aide" element={
              <Suspense fallback={fallback}>
                <ChefServiceAidePage />
              </Suspense>} />
            <Route path="profil" element={
              <Suspense fallback={fallback}>
                <ChefServiceProfilePage />
              </Suspense>} />
            <Route path="profil/mot-de-passe" element={
              <Suspense fallback={fallback}>
                <ChefServiceChangePasswordPage />
              </Suspense>} />
          </Route>
        </Route>
        <Route path="/controleur_gestion" element={
          <Suspense fallback={fallback}>
            <RoleBasedRoute allowedRoles={["controleur_gestion"]} />
          </Suspense>}>
          <Route element={<ControleurGestionLayout />}>
            <Route index element={
              <Suspense fallback={fallback}>
                <ControleurHomePage />
              </Suspense>} />
            <Route path="demande" element={
              <Suspense fallback={fallback}>
                <ControleurDemandesPage />
              </Suspense>} />
            <Route path="demande/view/:id" element={
              <Suspense fallback={fallback}>
                <ControleurDemandeViewPage />
              </Suspense>} />
            <Route path="demande/controle/:id" element={
              <Suspense fallback={fallback}>
                <ControleurDemandeControlePage />
              </Suspense>} />
            <Route path="controle/view/:id" element={
              <Suspense fallback={fallback}>
                <ControleurControleViewPage />
              </Suspense>} />
            <Route path="historique" element={
              <Suspense fallback={fallback}>
                <ControleurHistoriquePage />
              </Suspense>} />
            <Route path="aide" element={
              <Suspense fallback={fallback}>
                <ControleurAidePage />
              </Suspense>} />
            <Route path="profil" element={
              <Suspense fallback={fallback}>
                <ControleurProfilePage />
              </Suspense>} />
            <Route path="profil/mot-de-passe" element={
              <Suspense fallback={fallback}>
                <ControleurChangePasswordPage />
              </Suspense>} />
          </Route>
        </Route>
        <Route path="/agent_appro" element={
          <Suspense fallback={fallback}>
            <RoleBasedRoute allowedRoles={["agent_appro"]} />
          </Suspense>}>
          <Route element={<AgentApproLayout />}>
            <Route index element={
              <Suspense fallback={fallback}>
                <AgentApproHomePage />
              </Suspense>} />
            <Route path="ressource" element={
              <Suspense fallback={fallback}>
                <RessourcesPage />
              </Suspense>} />
            <Route path="ressource/create" element={
              <Suspense fallback={fallback}>
                <RessourceCreatePage />
              </Suspense>} />
            <Route path="ressource/edit/:id" element={
              <Suspense fallback={fallback}>
                <RessourceEditPage />
              </Suspense>} />
            <Route path="ressource/view/:id" element={
              <Suspense fallback={fallback}>
                <RessourceViewPage />
              </Suspense>} />
            <Route path="ressource/import" element={
              <Suspense fallback={fallback}>
                <RessourceImportPage />
              </Suspense>} />
            <Route path="bon-magasin" element={
              <Suspense fallback={fallback}>
                <AgentApproBonsMagasinPage />
              </Suspense>} />
            <Route path="bon-magasin/view/:id" element={
              <Suspense fallback={fallback}>
                <AgentApproBonMagasinViewPage />
              </Suspense>} />
            <Route path="approvisionnement" element={
              <Suspense fallback={fallback}>
                <AgentApproApprovisionnementsPage />
              </Suspense>} />
            <Route path="approvisionnement/view/:id" element={
              <Suspense fallback={fallback}>
                <AgentApproApprovisionnementViewPage />
              </Suspense>} />
            <Route path="approvisionnement/view/:id/verification-stock" element={
              <Suspense fallback={fallback}>
                <AgentApproVerificationStockPage />
              </Suspense>} />
            <Route path="bon-sortie" element={
              <Suspense fallback={fallback}>
                <AgentApproBonsSortiePage />
              </Suspense>} />
            <Route path="bon-sortie/create/:approvisionnementId" element={
              <Suspense fallback={fallback}>
                <BonSortieCreatePage />
              </Suspense>} />
            <Route path="bon-sortie/view/:id" element={
              <Suspense fallback={fallback}>
                <BonSortieViewPage />
              </Suspense>} />
            <Route path="livraison" element={
              <Suspense fallback={fallback}>
                <AgentApproLivraisonsPage />
              </Suspense>} />
            <Route path="livraison/view/:id" element={
              <Suspense fallback={fallback}>
                <AgentApproLivraisonViewPage />
              </Suspense>} />
            <Route path="demande-achat" element={
              <Suspense fallback={fallback}>
                <AgentApproDemandeAchatsPage />
              </Suspense>} />
            <Route path="demande-achat/create/:approvisionnementId" element={
              <Suspense fallback={fallback}>
                <AgentApproDemandeAchatCreatePage />
              </Suspense>} />
            <Route path="demande-achat/view/:id" element={
              <Suspense fallback={fallback}>
                <AgentApproDemandeAchatViewPage />
              </Suspense>} />
            <Route path="historique" element={
              <Suspense fallback={fallback}>
                <AgentApproHistoriquePage />
              </Suspense>} />
            <Route path="historique/demande" element={
              <Suspense fallback={fallback}>
                <AgentApproHistoriqueDemandePage />
              </Suspense>} />
            <Route path="historique/appro" element={
              <Suspense fallback={fallback}>
                <AgentApproHistoriqueApproPage />
              </Suspense>} />
            <Route path="historique/achat" element={
              <Suspense fallback={fallback}>
                <AgentApproHistoriqueAchatPage />
              </Suspense>} />
            <Route path="aide" element={
              <Suspense fallback={fallback}>
                <AgentApproAidePage />
              </Suspense>} />
            <Route path="profil" element={
              <Suspense fallback={fallback}>
                <AgentApproProfilePage />
              </Suspense>} />
            <Route path="profil/mot-de-passe" element={
              <Suspense fallback={fallback}>
                <AgentApproChangePasswordPage />
              </Suspense>} />
          </Route>
        </Route>
      </Routes>
  )
}

export default App
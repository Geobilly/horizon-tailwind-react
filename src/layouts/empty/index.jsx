import Footer from "components/footer/FooterAuthDefault";
import { Routes, Route } from "react-router-dom";
import AddCustomerPage from "views/agents/AddCustomerPage";

export default function Empty() {

  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                {/* Content area where routes will render */}
                <div className="flex-1">
                  <Routes>
                    <Route path="agents/:agentId/add-customer" element={<AddCustomerPage />} />
                  </Routes>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

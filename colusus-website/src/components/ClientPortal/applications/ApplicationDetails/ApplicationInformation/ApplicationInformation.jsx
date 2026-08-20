import {
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineFlag,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineTag,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatApplicationDate,
} from "../../application.utils";

import "./ApplicationInformation.css";


const getValue = (value, fallback = "Not provided") => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};


const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.length
      ? value.join(", ")
      : "Not provided";
  }

  if (typeof value === "object" && value !== null) {
    return "Available";
  }

  return getValue(value);
};


const ApplicationInformation = ({
  application,
}) => {

  const opportunity =
    application?.opportunity || {};


  const destinationCountry =
    application?.destinationCountry ||
    opportunity?.countryName;


  const applicationType =
    formatApplicationType(
      application?.type
    );


  const createdDate =
    formatApplicationDate(
      application?.createdAt
    );


  const updatedDate =
    formatApplicationDate(
      application?.updatedAt ||
      application?.createdAt
    );


  const information = [
    {
      key: "country",
      label: "Destination",
      value: getValue(
        destinationCountry
      ),
      icon: HiOutlineLocationMarker,
    },

    {
      key: "type",
      label: "Application Type",
      value: applicationType,
      icon: HiOutlineDocumentText,
    },

    {
      key: "category",
      label: "Category",
      value: getValue(
        opportunity?.category
      ),
      icon: HiOutlineTag,
    },

    {
      key: "location",
      label: "Location",
      value: getValue(
        opportunity?.location
      ),
      icon: HiOutlineFlag,
    },

    {
      key: "started",
      label: "Application Started",
      value: createdDate,
      icon: HiOutlineCalendar,
    },

    {
      key: "updated",
      label: "Last Updated",
      value: updatedDate,
      icon: HiOutlineCalendar,
    },
  ];


  /*
   * Remove fields that don't have
   * meaningful data.
   *
   * Country and type are kept because
   * they are core application identity.
   */

  const visibleInformation =
    information.filter(
      (item) => {

        if (
          item.key === "country" ||
          item.key === "type"
        ) {
          return true;
        }

        return (
          item.value &&
          item.value !== "Not provided"
        );
      }
    );


  return (
    <section className="application-information">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="application-information-header">

        <div>

          <span>
            APPLICATION INFORMATION
          </span>

          <h2>
            Application details
          </h2>

          <p>
            A summary of the information associated
            with your application.
          </p>

        </div>


        <div className="application-information-icon">
          <HiOutlineInformationCircle />
        </div>

      </div>


      {/* =====================================================
          INFORMATION GRID
      ===================================================== */}

      <div className="application-information-grid">

        {visibleInformation.map(
          ({
            key,
            label,
            value,
            icon: Icon,
          }) => (

            <div
              key={key}
              className="application-information-item"
            >

              <div className="application-information-item-icon">
                <Icon />
              </div>


              <div className="application-information-item-content">

                <span>
                  {label}
                </span>

                <strong>
                  {value}
                </strong>

              </div>

            </div>

          )
        )}

      </div>


      {/* =====================================================
          NOTES
      ===================================================== */}

      {application?.notes && (
        <div className="application-information-notes">

          <div className="application-information-notes-icon">
            <HiOutlineInformationCircle />
          </div>

          <div>

            <span>
              APPLICATION NOTE
            </span>

            <p>
              {application.notes}
            </p>

          </div>

        </div>
      )}

    </section>
  );
};


export default ApplicationInformation;
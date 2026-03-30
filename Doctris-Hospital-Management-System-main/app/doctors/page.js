import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/features/doctors/doctorsSlice";
import { addNotification } from "@/features/ui/uiSlice";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { MagnifyingGlassIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const { doctorsList: doctors, status, error } = useSelector((state) => state.doctors);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(addNotification({ type: "error", message: error }));
    }
  }, [error, dispatch]);

  const loading = status === "loading" || status === "idle";

  const specialties = ["All", ...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleGetDirections = (location) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(location)}&travelmode=driving`,
            "_blank"
          );
        },
        () => {
          window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, "_blank");
        }
      );
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find a Doctor</h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Search by name, specialty, or location. Get instant directions to their clinic via Google Maps.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none text-sm transition-all"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none text-sm appearance-none cursor-pointer min-w-[180px]"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing <span className="font-bold text-slate-700">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? "s" : ""}
        </p>

        {/* Doctor Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-3/4 h-5 rounded-md" />
                    <Skeleton className="w-1/2 h-4 rounded-md" />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Skeleton className="flex-1 h-10 rounded-xl" />
                  <Skeleton className="w-24 h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-blue-500/20">
                      {doc.name.split(" ").slice(1).map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/doctors/${doc.id}`} className="block">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{doc.name}</h3>
                      </Link>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mt-1">
                        {doc.specialization}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="px-6 space-y-3 text-sm">
                  <div className="flex items-start gap-2.5 text-slate-600">
                    <MapPinIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <ClockIcon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{doc.availability}</span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <PhoneIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <a href={`tel:${doc.phone}`} className="hover:text-blue-600 transition-colors">{doc.phone}</a>
                    </div>
                  )}
                  {doc.email && (
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <EnvelopeIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <a href={`mailto:${doc.email}`} className="hover:text-blue-600 transition-colors truncate">{doc.email}</a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-5 flex gap-3">
                  <button
                    onClick={() => handleGetDirections(doc.location)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    Get Directions
                  </button>
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
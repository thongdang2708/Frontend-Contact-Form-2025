
export default function getEnvironments () {
    return import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY;
}
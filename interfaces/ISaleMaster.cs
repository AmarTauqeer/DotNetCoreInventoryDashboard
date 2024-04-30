
using DotNetCoreInventoryDashboard.dtos.SaleMaster;
using DotNetCoreInventoryDashboard.models;
namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface ISaleMaster
    {
        Task<List<SaleMaster>> GetAllAsync();
        Task<SaleMaster?> GetByIdAsync(int id);
        Task<SaleMaster> CreateAsync(SaleMaster saleMaster);
        Task<SaleMaster?> UpdateAsync(int id, CreateUpdateSaleMasterDto createUpdateSaleMasterDto);
        Task<SaleMaster?> DeleteAsync(int id);
    }
}

using DotNetCoreInventoryDashboard.dtos.SaleDetail;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface ISaleDetail
    {

        Task<List<SaleDetail>> GetAllAsync();
        Task<SaleDetail?> GetByIdAsync(int id);
        Task<SaleDetail> CreateAsync(SaleDetail saleDetail);
        Task<SaleDetail> UpdateAsync(int id, CreateUpdateSaleDetailDto createUpdateSaleDetailDto);
        Task<SaleDetail?> DeleteAsync(int id);
    }
}
